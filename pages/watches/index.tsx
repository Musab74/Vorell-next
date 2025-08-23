import React, { ChangeEvent, MouseEvent, useEffect, useState, useCallback } from 'react';
import { NextPage } from 'next';
import {
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { useRouter } from 'next/router';
import { WatchesInquiry } from '../../libs/types/watch/watch.input';
import { Watch } from '../../libs/types/watch/watch';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Direction, Message } from '../../libs/enums/common.enum';
import { GET_WATCHES } from '../../apollo/user/query';
import { useMutation, useQuery } from '@apollo/client';
import { T } from '../../libs/types/common';
import { LIKE_TARGET_WATCH } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import WatchCard from '../../libs/components/property/WatchesCard';
import Filter from '../../libs/components/property/Filter';

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

const WatchList: NextPage = ({ initialInput, ...props }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();

  const [searchFilter, setSearchFilter] = useState<WatchesInquiry>(
    router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput
  );
  const [watches, setWatches] = useState<Watch[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(searchFilter.page || 1);
  const likeInFlight = new Set<string>();
  const [searchText, setSearchText] = useState<string>(searchFilter?.search?.text ?? '');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sortingOpen, setSortingOpen] = useState(false);
  const [filterSortName, setFilterSortName] = useState(() => {
    if (searchFilter?.sort === 'price' && searchFilter?.direction === Direction.ASC) return 'Lowest Price';
    if (searchFilter?.sort === 'price' && searchFilter?.direction === Direction.DESC) return 'Highest Price';
    return 'Newest';
  });

  const [likeTargetWatch] = useMutation(LIKE_TARGET_WATCH);
  const {
    loading: getWatchesLoading,
    data: getWatchesData,
    error: getWatchesError,
    refetch: getWatchesRefetch,
  } = useQuery(GET_WATCHES, {
    fetchPolicy: 'network-only',
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setWatches(data?.getWatches?.list);
      setTotal(data?.getWatches?.metaCounter[0]?.total);
    },
  });

  useEffect(() => {
    if (router.query.input) {
      const inputObj = JSON.parse(router?.query?.input as string);
      setSearchFilter(inputObj);
      setSearchText(inputObj?.search?.text ?? '');
      setCurrentPage(inputObj.page ?? 1);
    }
  }, [router.query.input]);

 
const likeWatchHandler = async (user: T, id: string) => {
  try {
    if (!id) return;
    if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);

    // prevent rapid double toggles on same card
    if (likeInFlight.has(id)) return;
    likeInFlight.add(id);

    await likeTargetWatch({ variables: { watchId: id } });        
    await getWatchesRefetch({ input: searchFilter });            
    await sweetTopSmallSuccessAlert('Success', 800);
  } catch (err: any) {
    await sweetMixinErrorAlert(err?.message || Message.SOMETHING_WENT_WRONG);
  } finally {
    likeInFlight.delete(id);
  }
};


  const handlePaginationChange = async (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    const updatedFilter = { ...searchFilter, page: value };
    setSearchFilter(updatedFilter);
    setCurrentPage(value);
    await router.push(
      `/watches?input=${encodeURIComponent(JSON.stringify(updatedFilter))}`,
      undefined,
      { scroll: false }
    );
  };

  const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setSortingOpen(true);
  };
  const sortingCloseHandler = () => {
    setSortingOpen(false);
    setAnchorEl(null);
  };
  const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
    let updatedFilter = { ...searchFilter };
    switch (e.currentTarget.id) {
      case 'newest':
        updatedFilter = { ...updatedFilter, sort: 'createdAt', direction: Direction.DESC };
        setFilterSortName('Newest');
        break;
      case 'lowest':
        updatedFilter = { ...updatedFilter, sort: 'price', direction: Direction.ASC };
        setFilterSortName('Lowest Price');
        break;
      case 'highest':
        updatedFilter = { ...updatedFilter, sort: 'price', direction: Direction.DESC };
        setFilterSortName('Highest Price');
        break;
    }
    setSearchFilter(updatedFilter);
    setSortingOpen(false);
    setAnchorEl(null);
    router.push(`/watches?input=${encodeURIComponent(JSON.stringify(updatedFilter))}`, undefined, { scroll: false });
  };

  const handleTextSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const nextFilter = {
        ...searchFilter,
        search: {
          ...searchFilter.search,
          text: searchText,
        },
        page: 1,
      };
      setSearchFilter(nextFilter);
      setCurrentPage(1);
      await router.push(
        `/watches?input=${encodeURIComponent(JSON.stringify(nextFilter))}`,
        undefined,
        { scroll: false }
      );
    }
  };

  const refreshHandler = async () => {
    setSearchText('');
    setSearchFilter(initialInput);
    setCurrentPage(1);
    await router.push(`/watches?input=${encodeURIComponent(JSON.stringify(initialInput))}`, undefined, { scroll: false });
  };

  if (device === 'mobile') {
    return <h1 style={{ padding: 24 }}>WATCHES MOBILE</h1>;
  }

  return (
    <div id="watch-list-page" style={{ position: 'relative', background: '#f8f6f3', minHeight: '100vh' }}>
      <div className="watches-hero">
        <div className="collection-label">COLLECTION</div>
        <h1>FIND YOUR TIMEPIECE</h1>
        <div className="search-hero-box">
          <input
            className="hero-search-input"
            type="text"
            placeholder="Search by collection or reference"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onKeyDown={handleTextSearch}
          />
          <img src="/img/icons/search.svg" alt="search" />
        </div>
        <div className="hero-model-count">
          {total} model{total !== 1 ? 's' : ''} displayed.
          <button className="reset-btn" onClick={refreshHandler}>Reset Filters</button>
        </div>
      </div>

      <div className="container" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
        <Stack className={'filter-config'}>
          {/* @ts-ignore */}
          <Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
        </Stack>

        <div style={{ flex: 1, maxWidth: '1200px', position: 'relative' }}>

          <Stack className="main-config" mb={'76px'}>
            <Stack className={'list-config'}>
              {watches?.length === 0 ? (
                <div className={'no-data'}>
                  <img src="/img/icons/icoAlert.svg" alt="" />
                  <p>No Watches found!</p>
                </div>
              ) : (
                watches.map((watch: Watch) => (
                  <WatchCard watch={watch} likeWatchHandler={likeWatchHandler} key={watch?._id} />
                ))
              )}
            </Stack>
            <Stack className="pagination-config">
              {watches.length !== 0 && (
                <Stack className="pagination-box">
                  <Pagination
                    page={currentPage}
                    count={Math.ceil(total / searchFilter.limit)}
                    onChange={handlePaginationChange}
                    shape="circular"
                    color="primary"
                  />
                </Stack>
              )}
              {watches.length !== 0 && (
                <Stack className="total-result">
                  <Typography>
                    Total {total} model{total > 1 ? 's' : ''} available
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        </div>
      </div>
    </div>
  );
};

WatchList.defaultProps = {
  initialInput: {
    page: 1,
    limit: 9,
    sort: 'createdAt',
    direction: 'DESC',
    search: {
      pricesRange: {
        start: 0,
        end: 2000000,
      },
    },
  },
};

export default withLayoutBasic(WatchList);
