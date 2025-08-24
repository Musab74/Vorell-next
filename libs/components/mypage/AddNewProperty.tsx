import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { NEXT_APP_API_URL } from '../../config';
import axios from 'axios';
import { getJwtToken } from '../../auth';
import { sweetMixinErrorAlert, sweetMixinSuccessAlert } from '../../sweetAlert';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { CREATE_WATCH, UPDATE_WATCH } from '../../../apollo/user/mutation';
import { GET_WATCH } from '../../../apollo/user/query';
import {
  WatchOrigin,
  WatchType,
  Movement,
  WatchBrand,
  CaseDiameter,
} from '../../enums/watch.enum';

type WatchInputLocal = {
  _id?: string;
  watchType: WatchType | '';
  watchOrigin: WatchOrigin | '';
  modelName: string;
  brand: WatchBrand | '';
  price: number;
  caseDiameter: CaseDiameter | '';   // enum string (e.g., "MM40") or '' during editing
  movement: Movement | '';
  waterResistance: number;
  isLimitedEdition: boolean;
  releaseDate?: string;
  description: string;
  images: string[];
};

const AddProperty = ({ initialValues, ...props }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [insertWatchData, setInsertWatchData] = useState<WatchInputLocal>(initialValues);

  const [watchTypes] = useState<string[]>(Object.values(WatchType) as string[]);
  const [watchOrigins] = useState<string[]>(Object.values(WatchOrigin) as string[]);
  const [movementOptions] = useState<string[]>(Object.values(Movement) as string[]);
  const [brandOptions] = useState<string[]>(Object.values(WatchBrand) as string[]);

  const token = getJwtToken();
  const user = useReactiveVar(userVar);

  // Build case diameter options robustly (filter to strings before mapping)
  const caseDiameterOptions = React.useMemo(() => {
    const raw = Object.values(CaseDiameter) as unknown[];
    const values = raw.filter((x): x is string => typeof x === 'string');

    return values.map((v) => {
      if (v === 'OTH' || v === (CaseDiameter as any).OTH) {
        return { value: v as CaseDiameter, label: 'Other' };
      }
      if (v.startsWith('MM')) {
        return { value: v as CaseDiameter, label: `${v.slice(2)}mm` };
      }
      return { value: v as CaseDiameter, label: String(v) };
    });
  }, []);

  useEffect(() => {
    if (!user?._id) return;
    if (user.memberType !== 'STORE') router.back();
  }, [user, router]);

  const [createWatch] = useMutation(CREATE_WATCH);
  const [updateWatch] = useMutation(UPDATE_WATCH);

  const { loading: getWatchLoading, data: getWatchData } = useQuery(GET_WATCH, {
    fetchPolicy: 'network-only',
    variables: { input: router.query.watchId },
    skip: !router.query.watchId,
  });

  useEffect(() => {
    if (!getWatchLoading && getWatchData?.getWatch) {
      const w = getWatchData.getWatch;
      setInsertWatchData({
        _id: w._id,
        watchType: (w.watchType ?? '') as WatchType | '',
        watchOrigin: (w.watchOrigin ?? '') as WatchOrigin | '',
        modelName: w.modelName ?? '',
        brand: (w.brand ?? '') as WatchBrand | '',
        price: Number(w.price ?? 0),
        caseDiameter: (w.caseDiameter ?? '') as CaseDiameter | '', // keep enum string
        movement: (w.movement ?? '') as Movement | '',
        waterResistance: Number(w.waterResistance ?? 0),
        isLimitedEdition: !!w.isLimitedEdition,
        releaseDate: (w.releaseDate ?? '') as string,
        description: w.description ?? '',
        images: Array.isArray(w.images) ? w.images : [],
      });
    }
  }, [getWatchLoading, getWatchData]);

  async function uploadImages() {
    try {
      const inputEl = inputRef.current;
      const selectedFiles = inputEl?.files;
      if (!selectedFiles || selectedFiles.length === 0) return;

      const maxTotal = 5;
      const current = insertWatchData.images?.length || 0;
      const remaining = maxTotal - current;
      if (remaining <= 0) throw new Error(`You can upload up to ${maxTotal} images.`);
      const filesToSend = Array.from(selectedFiles).slice(0, remaining);

      const formData = new FormData();

      formData.append(
        'operations',
        JSON.stringify({
          query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) {
            imagesUploader(files: $files, target: $target)
          }`,
          variables: { files: filesToSend.map(() => null), target: 'watch' },
        })
      );

      const map: Record<string, string[]> = {};
      for (let i = 0; i < filesToSend.length; i++) {
        map[String(i)] = [`variables.files.${i}`];
      }
      formData.append('map', JSON.stringify(map));

      for (let i = 0; i < filesToSend.length; i++) {
        formData.append(String(i), filesToSend[i]);
      }

      const res = await axios.post(`${process.env.NEXT_APP_API_GRAPHQL_URL}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'apollo-require-preflight': true,
          Authorization: `Bearer ${token}`,
        },
      });

      const uploaded = res?.data?.data?.imagesUploader;
      const uploadedPaths: string[] = Array.isArray(uploaded) ? uploaded : (uploaded ? [uploaded] : []);

      setInsertWatchData(prev => ({
        ...prev,
        images: [...(prev.images || []), ...uploadedPaths],
      }));

      if (inputEl) inputEl.value = '';
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message || 'Failed to upload images.');
    }
  }

  const disabled = () =>
    !insertWatchData.modelName ||
    !insertWatchData.brand ||
    !insertWatchData.price ||
    !insertWatchData.watchType ||
    !insertWatchData.watchOrigin ||
    !insertWatchData.caseDiameter ||
    !insertWatchData.movement ||
    !insertWatchData.waterResistance ||
    !insertWatchData.description ||
    insertWatchData.images.length === 0;

  const insertWatchHandler = useCallback(async () => {
    try {
      const payload = {
        ...insertWatchData,
        price: Number(insertWatchData.price),
        waterResistance: Number(insertWatchData.waterResistance),
        caseDiameter: insertWatchData.caseDiameter as CaseDiameter,
        watchType: insertWatchData.watchType as WatchType,
        watchOrigin: insertWatchData.watchOrigin as WatchOrigin,
        brand: insertWatchData.brand as WatchBrand,
        movement: insertWatchData.movement as Movement,
      };
      await createWatch({ variables: { input: payload } });
      await sweetMixinSuccessAlert('Watch added successfully!');
      await router.push({ pathname: '/mypage', query: { category: 'myWatches' } });
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    }
  }, [createWatch, insertWatchData, router]);

  const updateWatchHandler = useCallback(async () => {
    try {
      const payload = {
        ...insertWatchData,
        price: Number(insertWatchData.price),
        waterResistance: Number(insertWatchData.waterResistance),
        caseDiameter: insertWatchData.caseDiameter as CaseDiameter,
        watchType: insertWatchData.watchType as WatchType,
        watchOrigin: insertWatchData.watchOrigin as WatchOrigin,
        brand: insertWatchData.brand as WatchBrand,
        movement: insertWatchData.movement as Movement,
      };
      await updateWatch({ variables: { input: payload } });
      await sweetMixinSuccessAlert('Watch updated successfully!');
      await router.push({ pathname: '/mypage', query: { category: 'myWatches' } });
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    }
  }, [updateWatch, insertWatchData, router]);

  if (device === 'mobile') return <div>ADD NEW WATCH (MOBILE)</div>;

  return (
    <div id="add-property-page">
      <Stack className="main-title-box">
        <Typography className="main-title">Add New Watch</Typography>
        <Typography className="sub-title">We are glad to see you again!</Typography>
      </Stack>

      <div>
        <Stack className="config">
          <Stack className="description-box">
            <Stack className="config-column">
              <Typography className="title">Model Name</Typography>
              <input
                type="text"
                className="description-input"
                placeholder="Model Name"
                value={insertWatchData.modelName}
                onChange={({ target: { value } }) =>
                  setInsertWatchData({ ...insertWatchData, modelName: value })
                }
              />
            </Stack>

            <Stack className="config-row">
              <Stack className="price-year-after-price">
                <Typography className="title">Price</Typography>
                <input
                  type="number"
                  className="description-input"
                  placeholder="Price"
                  value={insertWatchData.price}
                  onChange={({ target: { value } }) =>
                    setInsertWatchData({ ...insertWatchData, price: Number(value) })
                  }
                />
              </Stack>

              <Stack className="price-year-after-price">
                <Typography className="title">Select Type</Typography>
                <select
                  className="select-description"
                  value={insertWatchData.watchType || 'select'}
                  onChange={({ target: { value } }) =>
                    setInsertWatchData({ ...insertWatchData, watchType: value as WatchType })
                  }
                >
                  <option disabled value="select">Select</option>
                  {watchTypes.map((type) => (
                    <option value={type} key={type}>{type}</option>
                  ))}
                </select>
                <div className="divider"></div>
                <img src="/img/icons/Vector.svg" className="arrow-down" />
              </Stack>
            </Stack>

            <Stack className="config-row">
              <Stack className="price-year-after-price">
                <Typography className="title">Select Origin</Typography>
                <select
                  className="select-description"
                  value={insertWatchData.watchOrigin || 'select'}
                  onChange={({ target: { value } }) =>
                    setInsertWatchData({ ...insertWatchData, watchOrigin: value as WatchOrigin })
                  }
                >
                  <option disabled value="select">Select</option>
                  {watchOrigins.map((origin) => (
                    <option value={origin} key={origin}>{origin}</option>
                  ))}
                </select>
                <div className="divider"></div>
                <img src="/img/icons/Vector.svg" className="arrow-down" />
              </Stack>

              <Stack className="price-year-after-price">
                <Typography className="title">Brand</Typography>
                <select
                  className="select-description"
                  value={insertWatchData.brand || 'select'}
                  onChange={({ target: { value } }) =>
                    setInsertWatchData({ ...insertWatchData, brand: value as WatchBrand })
                  }
                >
                  <option disabled value="select">Select</option>
                  {brandOptions.map((b) => (
                    <option value={b} key={b}>{b}</option>
                  ))}
                </select>
                <div className="divider"></div>
                <img src="/img/icons/Vector.svg" className="arrow-down" />
              </Stack>
            </Stack>

            <Stack className="config-row">
              <Stack className="price-year-after-price">
                <Typography className="title">Limited Edition</Typography>
                <select
                  className="select-description"
                  value={insertWatchData.isLimitedEdition ? 'yes' : 'no'}
                  onChange={({ target: { value } }) =>
                    setInsertWatchData({ ...insertWatchData, isLimitedEdition: value === 'yes' })
                  }
                >
                  <option disabled value="select">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                <div className="divider"></div>
                <img src="/img/icons/Vector.svg" className="arrow-down" />
              </Stack>

              <Stack className="price-year-after-price">
                <Typography className="title">Water Resistance (m)</Typography>
                <input
                  type="number"
                  className="description-input"
                  placeholder="e.g., 100"
                  value={insertWatchData.waterResistance}
                  onChange={({ target: { value } }) =>
                    setInsertWatchData({ ...insertWatchData, waterResistance: Number(value) })
                  }
                />
              </Stack>
            </Stack>

            <Stack className="config-row">
              <Stack className="price-year-after-price">
                <Typography className="title">Case Diameter (mm)</Typography>
                <select
                  className="select-description"
                  value={insertWatchData.caseDiameter || 'select'}
                  onChange={({ target: { value } }) =>
                    setInsertWatchData({ ...insertWatchData, caseDiameter: value as CaseDiameter })
                  }
                >
                  <option disabled value="select">Select</option>
                  {caseDiameterOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <div className="divider"></div>
                <img src="/img/icons/Vector.svg" className="arrow-down" />
              </Stack>

              <Stack className="price-year-after-price">
                <Typography className="title">Movement</Typography>
                <select
                  className="select-description"
                  value={insertWatchData.movement || 'select'}
                  onChange={({ target: { value } }) =>
                    setInsertWatchData({ ...insertWatchData, movement: value as Movement })
                  }
                >
                  <option disabled value="select">Select</option>
                  {movementOptions.map((m) => (
                    <option value={m} key={m}>{m}</option>
                  ))}
                </select>
                <div className="divider"></div>
                <img src="/img/icons/Vector.svg" className="arrow-down" />
              </Stack>

              <Stack className="price-year-after-price">
                <Typography className="title">Release Date</Typography>
                <input
                  type="date"
                  className="description-input"
                  value={insertWatchData.releaseDate || ''}
                  onChange={({ target: { value } }) =>
                    setInsertWatchData({ ...insertWatchData, releaseDate: value })
                  }
                />
              </Stack>
            </Stack>

            <Typography className="property-title">Watch Description</Typography>
            <Stack className="config-column">
              <Typography className="title">Description</Typography>
              <textarea
                className="description-text"
                value={insertWatchData.description}
                onChange={({ target: { value } }) =>
                  setInsertWatchData({ ...insertWatchData, description: value })
                }
              />
            </Stack>
          </Stack>

          <Typography className="upload-title">Upload photos of your watch</Typography>
          <Stack className="images-box">
            <Stack className="upload-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="121" height="120" viewBox="0 0 121 120" fill="none"></svg>
              <Stack className="text-box">
                <Typography className="drag-title">Drag and drop images here</Typography>
                <Typography className="format-title">Photos must be JPEG or PNG format and least 2048x768</Typography>
              </Stack>
              <Button className="browse-button" onClick={() => inputRef.current?.click()}>
                <Typography className="browse-button-text">Browse Files</Typography>
                <input
                  ref={inputRef}
                  type="file"
                  hidden
                  onChange={uploadImages}
                  multiple
                  accept="image/jpg, image/jpeg, image/png"
                />
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none"></svg>
              </Button>
            </Stack>

            <Stack className="gallery-box">
              {insertWatchData?.images.map((image: string, idx: number) => {
                const imagePath: string = `${NEXT_APP_API_URL}/${image}`;
                return (
                  <Stack className="image-box" key={`${image}-${idx}`}>
                    <img src={imagePath} alt="" />
                  </Stack>
                );
              })}
            </Stack>
          </Stack>

          <Stack className="buttons-row">
            {router.query.watchId ? (
              <Button className="next-button" disabled={disabled()} onClick={updateWatchHandler}>
                <Typography className="next-button-text">Save</Typography>
              </Button>
            ) : (
              <Button className="next-button" disabled={disabled()} onClick={insertWatchHandler}>
                <Typography className="next-button-text">Save</Typography>
              </Button>
            )}
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

AddProperty.defaultProps = {
  initialValues: {
    watchType: '',
    watchOrigin: '',
    modelName: '',
    brand: '',
    price: 0,
    caseDiameter: '',    // enum string placeholder
    movement: '',
    waterResistance: 0,
    isLimitedEdition: false,
    releaseDate: '',
    description: '',
    images: [],
  } as WatchInputLocal,
};

export default AddProperty;
