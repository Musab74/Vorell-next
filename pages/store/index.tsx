// pages/store/index.tsx
import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Button, Pagination, Menu, MenuItem } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Member } from '../../libs/types/member/member';
import { LIKE_TARGET_MEMBER } from '../../apollo/user/mutation';
import { useMutation, useQuery } from '@apollo/client';
import { GET_STORES } from '../../apollo/user/query';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Message } from '../../libs/enums/common.enum';
import StoreCard from '../../libs/components/common/AgentCard';

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

const StoreList: NextPage = ({ initialInput }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();

  // Sorting UI
  const [filterSortName, setFilterSortName] = useState('Recent');
  const [sortingOpen, setSortingOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Filters & data
  const [searchFilter, setSearchFilter] = useState<any>(
    router?.query?.input ? JSON.parse(router.query.input as string) : initialInput
  );
  const [stores, setStores] = useState<Member[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');

  const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

  const { loading, refetch } = useQuery(GET_STORES, {
    fetchPolicy: 'network-only',
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: any) => {
      setStores(data?.getStores?.list ?? []);
      setTotal(data?.getStores?.metaCounter?.[0]?.total ?? 0);
    },
    onError: (e) => console.error('GET_STORES error:', e),
  });

  // Parse ?input=... when URL changes
  useEffect(() => {
    if (router.query.input) {
      try {
        const next = JSON.parse(router.query.input as string);
        if (!next.page || next.page < 1) next.page = 1;
        setSearchFilter(next);
      } catch {}
    }
  }, [router.query.input]);

  // Helpers
  const pushWithFilter = (f: any) => {
    router.push(`/store?input=${JSON.stringify(f)}`, `/store?input=${JSON.stringify(f)}`, { scroll: false });
  };

  // Sorting
  const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setSortingOpen(true);
  };
  const sortingCloseHandler = () => {
    setSortingOpen(false);
    setAnchorEl(null);
  };
  const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
    let f = { ...searchFilter };
    switch (e.currentTarget.id) {
      case 'watches':
        f = { ...f, sort: 'storeWatches', direction: 'DESC', page: 1 };
        setFilterSortName('Watches');
        break;
      case 'old':
        f = { ...f, sort: 'createdAt', direction: 'ASC', page: 1 };
        setFilterSortName('Oldest');
        break;
      case 'likes':
        f = { ...f, sort: 'memberLikes', direction: 'DESC', page: 1 };
        setFilterSortName('Likes');
        break;
      case 'views':
        f = { ...f, sort: 'memberViews', direction: 'DESC', page: 1 };
        setFilterSortName('Views');
        break;
      default:
        break;
    }
    setSearchFilter(f);
    setSortingOpen(false);
    setAnchorEl(null);
    pushWithFilter(f);
  };

  // Pagination
  const paginationChangeHandler = (_: ChangeEvent<unknown>, value: number) => {
    const f = { ...searchFilter, page: value > 0 ? value : 1 };
    setSearchFilter(f);
    pushWithFilter(f);
  };

  // Search (Enter)
  const onEnterSearch = (event: any) => {
    if (event.key === 'Enter') {
      const f = { ...searchFilter, search: { ...(searchFilter.search || {}), text: searchText }, page: 1 };
      setSearchFilter(f);
      pushWithFilter(f);
    }
  };

  // Like store
  const likeMemberHandler = async (user: any, id: string) => {
    try {
      if (!id) return;
      if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
      await likeTargetMember({ variables: { input: id } });
      await refetch({ input: searchFilter }); // correct refetch signature
      await sweetTopSmallSuccessAlert('success', 800);
    } catch (err: any) {
      sweetMixinErrorAlert(err.message).then();
    }
  };

  if (device === 'mobile') return <h1>STORES PAGE MOBILE</h1>;

  return (
    <Stack className="store-list-page">
      <Stack className="container">
        <Stack className="filter">
          <Box className="left" component="div">
            <input
              type="text"
              placeholder="Search for a store"
              value={searchText}
              onChange={(e: any) => setSearchText(e.target.value)}
              onKeyDown={onEnterSearch}
            />
          </Box>

          <Box className="right" component="div">
            <span>Sort by</span>
            <div>
              <Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
                {filterSortName}
              </Button>
              <Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
                <MenuItem onClick={sortingHandler} id="watches" disableRipple>Watches</MenuItem>
                <MenuItem onClick={sortingHandler} id="old" disableRipple>Oldest</MenuItem>
                <MenuItem onClick={sortingHandler} id="likes" disableRipple>Likes</MenuItem>
                <MenuItem onClick={sortingHandler} id="views" disableRipple>Views</MenuItem>
              </Menu>
            </div>
          </Box>
        </Stack>

        <Stack className="card-wrap">
          {loading ? (
            <div className="no-data"><p>Loading…</p></div>
          ) : stores.length === 0 ? (
            <div className="no-data">
              <img src="/img/icons/icoAlert.svg" alt="" />
              <p>No Stores found!</p>
            </div>
          ) : (
            stores.map((store: Member) => (
              <StoreCard store={store} likeMemberHandler={likeMemberHandler} key={store._id} />
            ))
          )}
        </Stack>

        <Stack className="pagination">
          <Stack className="pagination-box">
            {stores.length !== 0 && Math.ceil(total / searchFilter.limit) > 1 && (
              <Pagination
                page={searchFilter.page}
                count={Math.ceil(total / searchFilter.limit)}
                onChange={paginationChangeHandler}
                shape="circular"
                color="primary"
              />
            )}
          </Stack>
          {stores.length !== 0 && (
            <span> Total {total} store{total > 1 ? 's' : ''} available</span>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

StoreList.defaultProps = {
  initialInput: {
    page: 1, // start on page 1 so first load shows data
    limit: 6,
    sort: 'createdAt',
    direction: 'DESC',
    search: {},
  },
};

export default withLayoutBasic(StoreList);
