import React, { useState, useCallback } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Pagination, Stack, Typography } from '@mui/material';
import { Watch } from '../../types/watch/watch';
import { LIKE_TARGET_WATCH } from '../../../apollo/user/mutation';
import { GET_FAVORITES } from '../../../apollo/user/query';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { sweetMixinErrorAlert } from '../../sweetAlert';
import WatchesCard from '../property/WatchesCard';
import { Messages } from '../../config';

type Paging = { page: number; limit: number };

const MyFavoriteWatches: NextPage = () => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);

  const [myFavorites, setMyFavorites] = useState<Watch[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchFavorites, setSearchFavorites] = useState<Paging>({ page: 1, limit: 6 });

  const { loading, error, refetch } = useQuery(GET_FAVORITES, {
    fetchPolicy: 'network-only',
    variables: { input: searchFavorites },
    onCompleted: (data: any) => {
      setMyFavorites(data?.getFavorites?.list ?? []);
      setTotal(data?.getFavorites?.metaCounter?.[0]?.total ?? 0);
    },
  });

  const [likeTargetWatch] = useMutation(LIKE_TARGET_WATCH);

  const paginationHandler = (_e: any, value: number) => {
    setSearchFavorites((s) => ({ ...s, page: value }));
  };

  // remove immediately (no refresh needed)
  const likeWatchHandler = useCallback(
    async (currentUser: any, watchId: string) => {
      try {
        if (!watchId) return;
        if (!currentUser?._id) throw new Error(Messages.error2);

        // optimistic remove from list & adjust total
        setMyFavorites((prev) => prev.filter((w) => String(w._id) !== String(watchId)));
        setTotal((t) => Math.max(0, t - 1));

        await likeTargetWatch({
          variables: { watchId },
          update(cache) {
            const id = cache.identify({ __typename: 'Watch', _id: watchId });
            if (id) cache.evict({ id });
            cache.gc?.();
          },
        });

        // soft re-sync (keeps pagination accurate)
        await refetch({ input: searchFavorites });
      } catch (err: any) {
        await sweetMixinErrorAlert(err?.message || 'Failed to update like.');
        await refetch({ input: searchFavorites }); // rollback via server truth
      }
    },
    [likeTargetWatch, refetch, searchFavorites]
  );

  if (device === 'mobile') return <div>Vorell MY FAVORITE WATCHES (MOBILE)</div>;

  return (
    <div id="my-favorite-watches-page">
      <Stack className="main-title-box">
        <Stack className="right-box">
          <Typography className="main-title">My Favorite Watches</Typography>
          <Typography className="sub-title">Your collection of luxury favorites.</Typography>
        </Stack>
      </Stack>

      <Stack className="favorites-list-box">
        {loading ? (
          <div className="no-data"><img src="/img/icons/icoAlert.svg" alt="" /><p>Loading…</p></div>
        ) : error ? (
          <div className="no-data"><img src="/img/icons/icoAlert.svg" alt="" /><p>Failed to load favorites.</p></div>
        ) : myFavorites?.length ? (
          myFavorites.map((watch: Watch) => (
            <WatchesCard
              key={String(watch._id)}
              watch={watch}
              likeWatchHandler={likeWatchHandler}
              myFavorites={true}        // ensures filled heart on this page
            />
          ))
        ) : (
          <div className="no-data"><img src="/img/icons/icoAlert.svg" alt="" /><p>No Favorite Watches found!</p></div>
        )}
      </Stack>

      {myFavorites?.length ? (
        <Stack className="pagination-config">
          <Stack className="pagination-box">
            <Pagination
              count={Math.ceil((total || 0) / (searchFavorites.limit || 1))}
              page={searchFavorites.page}
              shape="circular"
              color="primary"
              onChange={paginationHandler}
            />
          </Stack>
          <Stack className="total-result">
            <Typography>Total {total} favorite watch{total > 1 ? 'es' : ''}</Typography>
          </Stack>
        </Stack>
      ) : null}
    </div>
  );
};

export default MyFavoriteWatches;
