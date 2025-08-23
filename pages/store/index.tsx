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
import { GET_STORES } from '../../apollo/user/query'; // Your custom query
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Message } from '../../libs/enums/common.enum';
import StoreCard from '../../libs/components/common/AgentCard';

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

const StoreList: NextPage = ({ initialInput, ...props }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();

  // Sorting
  const [filterSortName, setFilterSortName] = useState('Recent');
  const [sortingOpen, setSortingOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Filters
  const [searchFilter, setSearchFilter] = useState<any>(
    router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
  );
  const [stores, setStores] = useState<Member[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');

  /** APOLLO REQUESTS **/
  const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

  const {
    loading: getStoresLoading,
    data: getStoresData,
    error: getStoresError,
    refetch: getStoresRefetch,
  } = useQuery(GET_STORES, {
    fetchPolicy: 'network-only',
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: any) => {
      setStores(data?.getStores?.list);
      setTotal(data?.getStores?.metaCounter?.[0]?.total ?? 0);
    },
  });

  useEffect(() => {
	if (router.query.input) {
	  try {
		const input_obj = JSON.parse(router?.query?.input as string);
		if (!input_obj.page || input_obj.page < 1) input_obj.page = 1;
		setSearchFilter(input_obj);
	  } catch (e) {}
	}
  }, [router.query.input]);
  

  // Refetch on searchFilter change
  useEffect(() => {
    getStoresRefetch({ variables: { input: searchFilter } });
  }, [searchFilter]);

  /** HANDLERS **/
  const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setSortingOpen(true);
  };

  const sortingCloseHandler = () => {
    setSortingOpen(false);
    setAnchorEl(null);
  };

  const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
    let newFilter = { ...searchFilter };
    switch (e.currentTarget.id) {
      case 'watches':
        newFilter = { ...searchFilter, sort: 'storeWatches', direction: 'DESC', page: 1 };
        setFilterSortName('Watches');
        break;
      case 'old':
        newFilter = { ...searchFilter, sort: 'createdAt', direction: 'ASC', page: 1 };
        setFilterSortName('Oldest order');
        break;
      case 'likes':
        newFilter = { ...searchFilter, sort: 'memberLikes', direction: 'DESC', page: 1 };
        setFilterSortName('Likes');
        break;
      case 'views':
        newFilter = { ...searchFilter, sort: 'memberViews', direction: 'DESC', page: 1 };
        setFilterSortName('Views');
        break;
    }
    setSearchFilter(newFilter);
    setSortingOpen(false);
    setAnchorEl(null);
    // Also update URL for SSR/refresh
    router.push(
      `/store?input=${JSON.stringify(newFilter)}`,
      `/store?input=${JSON.stringify(newFilter)}`,
      { scroll: false }
    );
  };

  const paginationChangeHandler = (event: ChangeEvent<unknown>, value: number) => {
	const safePage = value > 0 ? value : 1;
	const newFilter = { ...searchFilter, page: safePage };
	setSearchFilter(newFilter);
	router.push(
	  `/store?input=${JSON.stringify(newFilter)}`,
	  `/store?input=${JSON.stringify(newFilter)}`,
	  { scroll: false }
	);
  };
  

  const likeMemberHandler = async (user: any, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.SOMETHING_WENT_WRONG);
      await likeTargetMember({ variables: { input: id } }); // server update

      await getStoresRefetch({ input: searchFilter }); // frontend update
      await sweetTopSmallSuccessAlert('success', 800);
    } catch (err: any) {
      console.error('ERROR on likeMemberHandler', err.message);
      sweetMixinErrorAlert(err.message).then();
    }
  };

  if (device === 'mobile') {
    return <h1>STORES PAGE MOBILE</h1>;
  } else {
    return (
      <Stack className={'store-list-page'}>
        <Stack className={'container'}>
          <Stack className={'filter'}>
            <Box component={'div'} className={'left'}>
              <input
                type="text"
                placeholder={'Search for a store'}
                value={searchText}
                onChange={(e: any) => setSearchText(e.target.value)}
                onKeyDown={(event: any) => {
                  if (event.key == 'Enter') {
                    const newFilter = {
                      ...searchFilter,
                      search: { ...searchFilter.search, text: searchText },
                      page: 1
                    };
                    setSearchFilter(newFilter);
                    router.push(
                      `/store?input=${JSON.stringify(newFilter)}`,
                      `/store?input=${JSON.stringify(newFilter)}`,
                      { scroll: false }
                    );
                  }
                }}
              />
            </Box>
            <Box component={'div'} className={'right'}>
              <span>Sort by</span>
              <div>
                <Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
                  {filterSortName}
                </Button>
                <Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
                  <MenuItem onClick={sortingHandler} id={'watches'} disableRipple>
                    Watches
                  </MenuItem>
                  <MenuItem onClick={sortingHandler} id={'old'} disableRipple>
                    Oldest
                  </MenuItem>
                  <MenuItem onClick={sortingHandler} id={'likes'} disableRipple>
                    Likes
                  </MenuItem>
                  <MenuItem onClick={sortingHandler} id={'views'} disableRipple>
                    Views
                  </MenuItem>
                </Menu>
              </div>
            </Box>
          </Stack>
          <Stack className={'card-wrap'}>
            {stores?.length === 0 ? (
              <div className={'no-data'}>
                <img src="/img/icons/icoAlert.svg" alt="" />
                <p>No Stores found!</p>
              </div>
            ) : (
              stores.map((store: Member) => {
                return <StoreCard store={store} likeMemberHandler={likeMemberHandler} key={store._id} />;
              })
            )}
          </Stack>
          <Stack className={'pagination'}>
            <Stack className="pagination-box">
              {stores.length !== 0 && Math.ceil(total / searchFilter.limit) > 1 && (
                <Stack className="pagination-box">
                  <Pagination
                    page={searchFilter.page}
                    count={Math.ceil(total / searchFilter.limit)}
                    onChange={paginationChangeHandler}
                    shape="circular"
                    color="primary"
                  />
                </Stack>
              )}
            </Stack>
            {stores.length !== 0 && (
              <span>
                Total {total} store{total > 1 ? 's' : ''} available
              </span>
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

StoreList.defaultProps = {
  initialInput: {
    page: 2,
    limit: 6,
    sort: 'createdAt',
    direction: 'DESC',
    search: {},
  },
};

export default withLayoutBasic(StoreList);
