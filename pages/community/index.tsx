import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Stack, Tab, Typography, Button, Pagination } from '@mui/material';
import CommunityCard from '../../libs/components/common/CommunityCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { BoardArticle } from '../../libs/types/board-article/board-article';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { BoardArticlesInquiry } from '../../libs/types/board-article/board-article.input';
import { BoardArticleCategory } from '../../libs/enums/board-article.enum';
import { useMutation, useQuery } from '@apollo/client';
import { LIKE_TARGET_BOARD_ARTICLE } from '../../apollo/user/mutation';
import { GET_BOARD_ARTICLES } from '../../apollo/user/query';
import { Message } from '../../libs/enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

const Community: NextPage = ({ initialInput, ...props }: T) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const { query } = router;

  const urlCategory = (query?.articleCategory as string) || 'FREE';

  const [searchCommunity, setSearchCommunity] = useState<BoardArticlesInquiry>({
    ...initialInput,
    search: { ...(initialInput?.search || {}), articleCategory: urlCategory as BoardArticleCategory },
  });

  const [boardArticles, setBoardArticles] = useState<BoardArticle[]>([]);
  const [total, setTotal] = useState<number>(0);

  /** APOLLO **/
  const [likeTargetArticle] = useMutation(LIKE_TARGET_BOARD_ARTICLE);

  const { loading: getArticlesLoading, refetch: getArticlesRefetch } = useQuery(GET_BOARD_ARTICLES, {
    fetchPolicy: 'cache-and-network',
    variables: { input: searchCommunity },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: any) => {
      setBoardArticles(data?.getBoardArticles?.list || []);
      setTotal(data?.getBoardArticles?.metaCounter?.[0]?.total || 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    // Ensure we always have a category in the URL (FREE default)
    if (!query?.articleCategory) {
      router.replace(
        { pathname: router.pathname, query: { articleCategory: 'FREE' } },
        router.pathname,
        { shallow: true }
      );
      return;
    }
    // Sync state when the URL category changes
    setSearchCommunity((prev) => ({
      ...prev,
      page: 1,
      search: { ...(prev.search || {}), articleCategory: urlCategory as BoardArticleCategory },
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCategory]);

  /** HANDLERS **/
  const tabChangeHandler = async (_: any, value: string) => {
    // Change URL; state sync happens via the useEffect above
    await router.replace(
      { pathname: '/community', query: { articleCategory: value } },
      router.pathname,
      { shallow: true }
    );
  };

  const paginationHandler = async (_: any, page: number) => {
    const next = { ...searchCommunity, page };
    setSearchCommunity(next);
    await getArticlesRefetch({ input: next }); // ensure immediate refresh on user action
  };

  const likeArticleHandler = async (e: any, user: T, id: string) => {
    try {
      e.stopPropagation();
      if (!id) return;
      if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);

      await likeTargetArticle({ variables: { input: id } });
      await getArticlesRefetch({ input: searchCommunity });
      await sweetTopSmallSuccessAlert('Success', 700);
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    }
  };

  if (device === 'mobile') {
    return <h1>COMMUNITY PAGE MOBILE</h1>;
  }

  return (
    <div id="community-list-page" className="vorell-community-list">
      <div className="container">
        <TabContext value={(searchCommunity.search?.articleCategory as string) || 'FREE'}>
          <Stack className="main-box">
            {/* LEFT: Brand + Tabs */}
            <Stack className="left-config">
              <Stack className="image-info">
                <img src="/img/logo/vorell-gold.png" alt="Vorell" />
                <Stack className="community-name">
                  <Typography className="name">Vorell Community</Typography>
                </Stack>
              </Stack>

              <TabList
                orientation="vertical"
                aria-label="community categories"
                TabIndicatorProps={{ style: { display: 'none' } }}
                onChange={tabChangeHandler}
              >
                <Tab
                  value="FREE"
                  label="General"
                  className={`tab-button ${searchCommunity.search?.articleCategory === 'FREE' ? 'active' : ''}`}
                />
                <Tab
                  value="RECOMMEND"
                  label="Recommendations"
                  className={`tab-button ${searchCommunity.search?.articleCategory === 'RECOMMEND' ? 'active' : ''}`}
                />
                <Tab
                  value="NEWS"
                  label="Watch News"
                  className={`tab-button ${searchCommunity.search?.articleCategory === 'NEWS' ? 'active' : ''}`}
                />
                <Tab
                  value="HUMOR"
                  label="Humor"
                  className={`tab-button ${searchCommunity.search?.articleCategory === 'HUMOR' ? 'active' : ''}`}
                />
              </TabList>
            </Stack>

            {/* RIGHT: Panels */}
            <Stack className="right-config">
              <Stack className="panel-config">
                <Stack className="title-box">
                  <Stack className="left">
                    <Typography className="title">
                      {(searchCommunity.search?.articleCategory as string) || 'FREE'} BOARD
                    </Typography>
                    <Typography className="sub-title">
                      Share refined opinions on haute horlogerie—keep it elegant.
                    </Typography>
                  </Stack>
                  <Button
                    onClick={() =>
                      router.push({
                        pathname: '/mypage',
                        query: { category: 'writeArticle' },
                      })
                    }
                    className="right"
                  >
                    Write
                  </Button>
                </Stack>

                {(['FREE', 'RECOMMEND', 'NEWS', 'HUMOR'] as const).map((cat) => (
                  <TabPanel value={cat} key={cat}>
                    <Stack className="list-box">
                      {total ? (
                        boardArticles.map((boardArticle: BoardArticle) => (
                          <CommunityCard
                            boardArticle={boardArticle}
                            likeArticleHandler={likeArticleHandler}
                            key={boardArticle?._id}
                          />
                        ))
                      ) : (
                        <Stack className="no-data">
                          <img src="/img/icons/icoAlert.svg" alt="" />
                          <p>No Article found!</p>
                        </Stack>
                      )}
                    </Stack>
                  </TabPanel>
                ))}
              </Stack>
            </Stack>
          </Stack>
        </TabContext>

        {total > 0 && (
          <Stack className="pagination-config">
            <Stack className="pagination-box">
              <Pagination
                count={Math.ceil(total / (searchCommunity.limit || 1))}
                page={searchCommunity.page}
                shape="circular"
                color="primary"
                onChange={paginationHandler}
              />
            </Stack>
            <Stack className="total-result">
              <Typography>
                Total {total} article{total > 1 ? 's' : ''} available
              </Typography>
            </Stack>
          </Stack>
        )}
      </div>
    </div>
  );
};

Community.defaultProps = {
  initialInput: {
    page: 1,
    limit: 6,
    sort: 'createdAt',
    direction: 'ASC',
    search: {
      articleCategory: 'FREE',
    },
  },
};

export default withLayoutBasic(Community);
