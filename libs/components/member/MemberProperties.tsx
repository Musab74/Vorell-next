import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_WATCHES } from '../../../apollo/user/query'; // <- ensure this exports your query shown below
import { Watch } from '../../types/watch/watch';
import { WatchesInquiry } from '../../types/watch/watch.input';
import { T } from '../../types/common';

const MyWatches: NextPage = ({ initialInput, ...props }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const { memberId } = router.query;

  const [searchFilter, setSearchFilter] = useState<WatchesInquiry>({ ...initialInput });
  const [watches, setWatches] = useState<Watch[]>([]);
  const [total, setTotal] = useState<number>(0);

  /** APOLLO REQUESTS **/
  const {
    loading: getWatchesLoading,
    data: getWatchesData,
    error: getWatchesError,
    refetch: getWatchesRefetch,
  } = useQuery(GET_WATCHES, {
    fetchPolicy: 'network-only',
    variables: { input: searchFilter },
    skip: !searchFilter?.search?.memberId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setWatches(data?.getWatches?.list ?? []);
      setTotal(data?.getWatches?.metaCounter?.[0]?.total ?? 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (memberId) {
      setSearchFilter({
        ...initialInput,
        search: { ...(initialInput.search ?? {}), memberId: memberId as string },
      });
    }
  }, [memberId]);

  useEffect(() => {
    if (searchFilter?.search?.memberId) getWatchesRefetch().then();
  }, [searchFilter]);

  /** HANDLERS **/
  const paginationHandler = (_e: T, value: number) => {
    setSearchFilter({ ...searchFilter, page: value });
  };

  if (device === 'mobile') {
    return <div>Vorell WATCHES MOBILE</div>;
  } else {
    return (
      <div id="member-properties-page">
        <Stack className="main-title-box">
          <Stack className="right-box">
            <Typography className="main-title">Watches</Typography>
          </Stack>
        </Stack>

        <Stack className="properties-list-box">
          <Stack className="list-box">
            {watches?.length > 0 && (
              <Stack className="listing-title-box">
                <Typography className="title-text">Model</Typography>
                <Typography className="title-text">Brand</Typography>
                <Typography className="title-text">Status</Typography>
                <Typography className="title-text">Views</Typography>
              </Stack>
            )}

            {watches?.length === 0 && (
              <div className={'no-data'}>
                <img src="/img/icons/icoAlert.svg" alt="" />
                <p>No watch found!</p>
              </div>
            )}

            {watches?.map((w: Watch) => (
              <div className="property-card-row" key={w?._id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, alignItems: 'center', padding: '14px 8px', borderBottom: '1px solid #eee' }}>
                <Typography className="row-cell">{w?.modelName ?? '-'}</Typography>
                <Typography className="row-cell">{w?.brand ?? '-'}</Typography>
                <Typography className="row-cell">{w?.watchStatus ?? '-'}</Typography>
                <Typography className="row-cell">{w?.watchViews ?? 0}</Typography>
              </div>
            ))}

            {watches.length !== 0 && (
              <Stack className="pagination-config">
                <Stack className="pagination-box">
                  <Pagination
                    count={Math.ceil(total / searchFilter.limit) || 1}
                    page={searchFilter.page}
                    shape="circular"
                    color="primary"
                    onChange={paginationHandler}
                  />
                </Stack>
                <Stack className="total-result">
                  <Typography>{total} watch{total === 1 ? '' : 'es'} available</Typography>
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
    // direction: 'DESC', // add if your API expects it
    search: {
      memberId: '',
    },
  },
};

export default MyWatches;
