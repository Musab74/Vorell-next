import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import PropertyCard from '../property/WatchesCard';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { GET_VISITED } from '../../../apollo/user/query';

type Watch = {
  _id: string;
};

const RecentlyVisited: NextPage = () => {
  const device = useDeviceDetect();
  const [items, setItems] = useState<Watch[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [input, setInput] = useState<{ page: number; limit: number }>({ page: 1, limit: 6 });

  const { loading, error } = useQuery(GET_VISITED, {
    fetchPolicy: 'network-only',
    variables: { input },
    onCompleted: (data: T) => {
      setItems(data?.getVisited?.list ?? []);
      setTotal(data?.getVisited?.metaCounter?.[0]?.total ?? 0);
    },
  });

  const onPage = (_e: any, page: number) => setInput((s) => ({ ...s, page }));

  if (device === 'mobile') return <div>Vorell RECENTLY VISITED (MOBILE)</div>;

  return (
    <div id="my-favorite-watches-page">
      <Stack className="main-title-box">
        <Stack className="right-box">
          <Typography className="main-title">Recently Visited</Typography>
          <Typography className="sub-title">We’re glad to see you again!</Typography>
        </Stack>
      </Stack>

      <Stack className="favorites-list-box">
        {loading ? (
          <div className="no-data"><img src="/img/icons/icoAlert.svg" alt="" /><p>Loading…</p></div>
        ) : error ? (
          <div className="no-data"><img src="/img/icons/icoAlert.svg" alt="" /><p>Failed to load.</p></div>
        ) : items.length ? (
          items.map((watch: Watch) => (
            <PropertyCard key={watch._id} watch={watch} recentlyVisited />
          ))
        ) : (
          <div className="no-data"><img src="/img/icons/icoAlert.svg" alt="" /><p>No recently visited found!</p></div>
        )}
      </Stack>

      {items.length > 0 && (
        <Stack className="pagination-config">
          <Stack className="pagination-box">
            <Pagination
              count={Math.ceil(total / input.limit)}
              page={input.page}
              shape="circular"
              color="primary"
              onChange={onPage}
            />
          </Stack>
          <Stack className="total-result">
            <Typography>Total {total} item{total === 1 ? '' : 's'}</Typography>
          </Stack>
        </Stack>
      )}
    </div>
  );
};

export default RecentlyVisited;
