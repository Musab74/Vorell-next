import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, List, ListItem, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_WATCHES_BY_ADMIN } from '../../../apollo/admin/query';
import { UPDATE_WATCH_BY_ADMIN, REMOVE_WATCH_BY_ADMIN } from '../../../apollo/admin/mutation';
import { WatchOrigin, WatchStatus } from '../../../libs/enums/watch.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { WatchPanelList } from '../../../libs/components/admin/watches/WatchesList';

/** Types aligned to your admin query shape */
type AllWatchesInquiry = {
  page: number;
  limit: number;
  sort?: string;
  direction?: 'ASC' | 'DESC';
  search?: {
    watchStatus?: WatchStatus;
    originList?: WatchOrigin[];
  };
};

type WatchUpdate = {
  _id: string;
  watchStatus?: WatchStatus;
};

const AdminWatches: NextPage = ({ initialInquiry, ...props }: any) => {
  const [watchesInquiry, setWatchesInquiry] = useState<AllWatchesInquiry>(initialInquiry);
  const [value, setValue] = useState<string>(
    watchesInquiry?.search?.watchStatus ?? 'ALL'
  );
  const [originFilter, setOriginFilter] = useState<string>('ALL');

  const [watches, setWatches] = useState<any[]>([]);
  const [watchesTotal, setWatchesTotal] = useState<number>(0);

  /** APOLLO REQUESTS **/
  const { loading, error, data, refetch } = useQuery(GET_ALL_WATCHES_BY_ADMIN, {
    fetchPolicy: 'network-only',
    variables: { input: watchesInquiry },
    notifyOnNetworkStatusChange: true,
    onCompleted: (d) => {
      setWatches(d?.getAllWatchesByAdmin?.list ?? []);
      setWatchesTotal(d?.getAllWatchesByAdmin?.metaCounter?.total ?? 0);
    },
  });

  const [updateWatchByAdmin] = useMutation(UPDATE_WATCH_BY_ADMIN, {
    onCompleted: () => refetch({ input: watchesInquiry }),
  });

  const [removeWatchByAdmin] = useMutation(REMOVE_WATCH_BY_ADMIN, {
    onCompleted: () => refetch({ input: watchesInquiry }),
  });

  /** LIFECYCLE **/
  useEffect(() => {
    refetch({ input: watchesInquiry });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchesInquiry]);

  /** HANDLERS **/
  const changePageHandler = async (_: unknown, newPage: number) => {
    const next = { ...watchesInquiry, page: newPage + 1 };
    setWatchesInquiry(next);
  };

  const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = { ...watchesInquiry, limit: parseInt(event.target.value, 10), page: 1 };
    setWatchesInquiry(next);
  };

  const tabChangeHandler = async (_: any, newValue: string) => {
    setValue(newValue);
    const base = { ...watchesInquiry, page: 1, sort: 'createdAt' as const };

    switch (newValue) {
      case 'IN_STOCK':
        setWatchesInquiry({ ...base, search: { ...base.search, watchStatus: WatchStatus.IN_STOCK } });
        break;
      case 'OUT_OF_STOCK':
        setWatchesInquiry({ ...base, search: { ...base.search, watchStatus: WatchStatus.OUT_OF_STOCK } });
        break;
      case 'SOLD':
        setWatchesInquiry({ ...base, search: { ...base.search, watchStatus: WatchStatus.SOLD } });
        break;
      case 'DELETE':
        setWatchesInquiry({ ...base, search: { ...base.search, watchStatus: WatchStatus.DELETE } });
        break;
      default: {
        // ALL
        const next = { ...base };
        if (next.search) delete next.search.watchStatus;
        setWatchesInquiry(next);
        break;
      }
    }
  };

  const originFilterHandler = (newValue: string) => {
    setOriginFilter(newValue);
    const base = { ...watchesInquiry, page: 1, sort: 'createdAt' as const };

    if (newValue !== 'ALL') {
      setWatchesInquiry({
        ...base,
        search: {
          ...base.search,
          originList: [newValue as WatchOrigin],
        },
      });
    } else {
      const next = { ...base };
      if (next.search) delete next.search.originList;
      setWatchesInquiry(next);
    }
  };

  const updateWatchHandler = async (updateData: WatchUpdate) => {
    try {
      await updateWatchByAdmin({ variables: { input: updateData } });
    } catch (err: any) {
      sweetErrorHandling(err);
    }
  };

  const removeWatchHandler = async (id: string) => {
    try {
      if (await sweetConfirmAlert('Are you sure to remove?')) {
        await removeWatchByAdmin({ variables: { input: id } });
      }
    } catch (err: any) {
      sweetErrorHandling(err);
    }
  };

  return (
    <Box component="div" className="content">
      <Typography variant="h2" className="tit" sx={{ mb: '24px' }}>
        Watch List
      </Typography>

      <Box component="div" className="table-wrap">
        <Box component="div" sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={value}>
            <Box component="div">
              <List className="tab-menu">
                <ListItem onClick={(e: any) => tabChangeHandler(e, 'ALL')} value="ALL" className={value === 'ALL' ? 'li on' : 'li'}>
                  All
                </ListItem>
                <ListItem onClick={(e: any) => tabChangeHandler(e, 'IN_STOCK')} value="IN_STOCK" className={value === 'IN_STOCK' ? 'li on' : 'li'}>
                  In Stock
                </ListItem>
                <ListItem onClick={(e: any) => tabChangeHandler(e, 'OUT_OF_STOCK')} value="OUT_OF_STOCK" className={value === 'OUT_OF_STOCK' ? 'li on' : 'li'}>
                  Out of Stock
                </ListItem>
                <ListItem onClick={(e: any) => tabChangeHandler(e, 'SOLD')} value="SOLD" className={value === 'SOLD' ? 'li on' : 'li'}>
                  Sold
                </ListItem>
                <ListItem onClick={(e: any) => tabChangeHandler(e, 'DELETE')} value="DELETE" className={value === 'DELETE' ? 'li on' : 'li'}>
                  Delete
                </ListItem>
              </List>

              <Divider />

              <Stack className="search-area" sx={{ m: '24px' }}>
                <Select sx={{ width: '160px', mr: '20px' }} value={originFilter}>
                  <MenuItem value="ALL" onClick={() => originFilterHandler('ALL')}>
                    ALL
                  </MenuItem>
                  {Object.values(WatchOrigin).map((origin) => (
                    <MenuItem value={origin} onClick={() => originFilterHandler(origin)} key={origin}>
                      {origin}
                    </MenuItem>
                  ))}
                </Select>
              </Stack>

              <Divider />
            </Box>

            <WatchPanelList
              watches={watches}
              updateWatchHandler={updateWatchHandler}
              removeWatchHandler={removeWatchHandler}
            />

            <TablePagination
              rowsPerPageOptions={[10, 20, 40, 60]}
              component="div"
              count={watchesTotal}
              rowsPerPage={watchesInquiry?.limit}
              page={watchesInquiry?.page - 1}
              onPageChange={changePageHandler}
              onRowsPerPageChange={changeRowsPerPageHandler}
            />
          </TabContext>
        </Box>
      </Box>
    </Box>
  );
};

AdminWatches.defaultProps = {
  initialInquiry: {
    page: 1,
    limit: 10,
    sort: 'createdAt',
    direction: 'DESC',
    search: {},
  } as AllWatchesInquiry,
};

export default withAdminLayout(AdminWatches);
