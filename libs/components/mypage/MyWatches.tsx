import React, { useMemo, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography, Avatar, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { T } from '../../types/common';
import { userVar } from '../../../apollo/store';
import { useRouter } from 'next/router';
import { sweetConfirmAlert, sweetErrorHandling } from '../../sweetAlert';
import { UPDATE_WATCH } from '../../../apollo/user/mutation';
import { GET_STORE_WATCHES } from '../../../apollo/user/query';
import { Watch } from '../../types/watch/watch';
import { WatchesInquiry } from '../../types/watch/watch.input';
import { WatchStatus } from '../../enums/watch.enum';

const WatchManageCard = ({
  watch,
  deleteWatchHandler,
  updateWatchHandler,
}: {
  watch: Watch;
  deleteWatchHandler: (id: string) => void | Promise<void>;
  updateWatchHandler: (status: string, id: string) => void | Promise<void>;
}) => {
  const thumb = useMemo(() => {
    const API = process.env.NEXT_APP_API_URL || '';
    return watch?.images?.[0] ? `${API}/${watch.images[0]}` : '/img/watches/placeholder.png';
  }, [watch?.images]);

  console.log("watchImages", watch?.images[0]);
  

  const views = Number.isFinite(Number(watch.watchViews)) ? Number(watch.watchViews) : 0;

  return (
    <Stack className="listing-item" direction="row" alignItems="center" justifyContent="space-between">
      <Stack className="title-col" direction="row" alignItems="center" gap={12}>
        <Avatar src={thumb} variant="rounded" sx={{ width: 56, height: 56 }} />
        <Typography className="title-text">
          {watch.brand || '-'} {watch.modelName || ''}
        </Typography>
      </Stack>

      <Typography className="title-text">
        {watch.createdAt ? new Date(watch.createdAt).toLocaleDateString() : '-'}
      </Typography>

      <Typography className="title-text">{watch.watchStatus || '-'}</Typography>

      <Typography className="title-text">{views}</Typography>

      {watch.watchStatus === 'IN_STOCK' && (
        <Stack direction="row" gap={1}>
          <button className="action-btn" onClick={() => updateWatchHandler('SOLD', watch._id)}>
            Mark as Sold
          </button>
          <button className="action-btn danger" onClick={() => deleteWatchHandler(watch._id)}>
            Delete
          </button>
        </Stack>
      )}
    </Stack>
  );
};

const MyWatches: NextPage = ({ initialInput, ...props }: any) => {
  const device = useDeviceDetect();
  const [searchFilter, setSearchFilter] = useState<WatchesInquiry>(initialInput);
  const [myWatches, setMyWatches] = useState<Watch[]>([]);
  const [total, setTotal] = useState<number>(0);
  const user = useReactiveVar(userVar);
  const router = useRouter();

  /** APOLLO REQUESTS **/
  const [updateWatchByAdmin] = useMutation(UPDATE_WATCH);

  const {
    loading: getStoreWatchesLoading,
    data: getStoreWatchesData,
    error: getStoreWatchesError,
    refetch: getStoreWatchesRefetch,
  } = useQuery(GET_STORE_WATCHES, {
    fetchPolicy: 'network-only',
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setMyWatches(data?.getStoreWatches?.list ?? []);
      setTotal(Number(data?.getStoreWatches?.metaCounter?.[0]?.total ?? 0));
    },
  });

  /** HANDLERS **/
  const paginationHandler = (e: T, value: number) => {
    setSearchFilter({ ...searchFilter, page: value });
  };

  const changeStatusHandler = (value: WatchStatus) => {
    setSearchFilter({ ...searchFilter, search: { watchStatus: value } });
  };

  const deleteWatchHandler = async (id: string) => {
    try {
      if (await sweetConfirmAlert('Are you sure to delete this watch?')) {
        await updateWatchByAdmin({
          variables: { input: { _id: id, watchStatus: 'DELETE' } },
        });
        await getStoreWatchesRefetch({ input: searchFilter });
      }
    } catch (err: any) {
      await sweetErrorHandling(err);
    }
  };

  const updateWatchHandler = async (status: string, id: string) => {
    try {
      if (await sweetConfirmAlert(`Are you sure to change to ${status} status?`)) {
        await updateWatchByAdmin({
          variables: { input: { _id: id, watchStatus: status } },
        });
        await getStoreWatchesRefetch({ input: searchFilter });
      }
    } catch (err: any) {
      await sweetErrorHandling(err);
    }
  };

  // Same access guard pattern, adjust memberType if needed
  if (user?.memberType !== 'STORE') {
    router.back();
  }

  if (device === 'mobile') {
    return <div>MY WATCHES MOBILE</div>;
  } else {
    return (
      <div id="my-watch-page">
        <Stack className="main-title-box">
          <Stack className="right-box">
            <Typography className="main-title">My Watches</Typography>
            <Typography className="sub-title">We are glad to see you again!</Typography>
          </Stack>
        </Stack>

        <Stack className="watch-list-box">
          <Stack className="tab-name-box">
            <Typography
              onClick={() => changeStatusHandler(WatchStatus.IN_STOCK)}
              className={searchFilter.search?.watchStatus === 'IN_STOCK' ? 'active-tab-name' : 'tab-name'}
            >
              On Sale
            </Typography>
            <Typography
              onClick={() => changeStatusHandler(WatchStatus.SOLD)}
              className={searchFilter.search?.watchStatus === 'SOLD' ? 'active-tab-name' : 'tab-name'}
            >
              On Sold
            </Typography>
          </Stack>

          <Stack className="list-box"> 
            <Stack className="listing-title-box">
              <Typography className="title-text">Listing title</Typography>
              <Typography className="title-text">Date Published</Typography>
              <Typography className="title-text">Status</Typography>
              <Typography className="title-text">View</Typography>
              {searchFilter.search?.watchStatus === 'IN_STOCK' && (
                <Typography className="title-text">Action</Typography>
              )}
            </Stack>

            {myWatches?.length === 0 ? (
              <div className={'no-data'}>
                <img src="/img/icons/icoAlert.svg" alt="" />
                <p>No Watch found!</p>
              </div>
            ) : (
              myWatches.map((watch: Watch) => (
                <WatchManageCard
                  key={watch._id}
                  watch={watch}
                  deleteWatchHandler={deleteWatchHandler}
                  updateWatchHandler={updateWatchHandler}
                />
              ))
            )}

            {myWatches.length !== 0 && (
              <Stack className="pagination-config">
                <Stack className="pagination-box">
                  <Pagination
                    count={Math.ceil(total / searchFilter.limit)}
                    page={searchFilter.page}
                    shape="circular"
                    color="primary"
                    onChange={paginationHandler}
                  />
                </Stack>
                <Stack className="total-result">
                  <Typography>{total} watch available</Typography>
                </Stack>
              </Stack>
            )}
          </Stack>
        </Stack>
      </div>
    );
  }
};

MyWatches.defaultProps = {
  initialInput: {
    page: 1,
    limit: 5,
    sort: 'createdAt',
    search: {
      watchStatus: 'IN_STOCK' as WatchStatus,
    },
  },
};

export default MyWatches;
