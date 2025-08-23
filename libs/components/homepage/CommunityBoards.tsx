import React, { useState } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography } from '@mui/material';
import CommunityCard from './CommunityCard';
import { BoardArticle } from '../../types/board-article/board-article';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { BoardArticleCategory } from '../../enums/board-article.enum';

const CommunityBoards = () => {
  const device = useDeviceDetect();
  const [searchCommunity, setSearchCommunity] = useState({
    page: 1,
    sort: 'articleViews',
    direction: 'DESC',
  });
  const [newsArticles, setNewsArticles] = useState<BoardArticle[]>([]);
  const [freeArticles, setFreeArticles] = useState<BoardArticle[]>([]);

  /** APOLLO REQUESTS **/

  const {
    loading: getNewsArticlesLoading,
    data: getNewsArticlesData,
    error: getNewsArticlesError,
    refetch: getNewsArticlesRefetch,
  } = useQuery(GET_BOARD_ARTICLES, {
    fetchPolicy: 'network-only',
    variables: { input: { ...searchCommunity, limit: 6, search: { articleCategory: BoardArticleCategory.NEWS } } },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setNewsArticles(data?.getBoardArticles?.list || []);
    },
  });

  const {
    loading: getFreeArticlesLoading,
    data: getFreeArticlesData,
    error: getFreeArticlesError,
    refetch: getFreeArticlesRefetch,
  } = useQuery(GET_BOARD_ARTICLES, {
    fetchPolicy: 'network-only',
    variables: { input: { ...searchCommunity, limit: 6, search: { articleCategory: BoardArticleCategory.FREE } } },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setFreeArticles(data?.getBoardArticles?.list || []);
    },
  });

  // Loading or error states (optional)
  if (getNewsArticlesLoading || getFreeArticlesLoading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
        <Typography variant="h5" color="text.secondary">
          Loading community boards...
        </Typography>
      </Stack>
    );
  }

  if (getNewsArticlesError || getFreeArticlesError) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
        <Typography variant="h5" color="error">
          Error loading community boards.
        </Typography>
      </Stack>
    );
  }

  // MOBILE (optional: you can add similar empty states here too)
  if (device === 'mobile') {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
        <Typography variant="h6" color="text.secondary">
          COMMUNITY BOARDS (MOBILE)
        </Typography>
      </Stack>
    );
  }

  // DESKTOP
  return (
    <Stack className={'community-board'} id='news-section' >
      <Stack className={'container'}>
        <Stack>
          <Typography variant={'h1'} sx={{ textAlign: 'center', mt: 4, mb: 6, fontWeight: 700, fontSize: 36 }}>
            COMMUNITY BOARD HIGHLIGHTS
          </Typography>
        </Stack>
        <Stack className="community-main" direction="row" spacing={5}>
          {/* NEWS COLUMN */}
          <Stack className={'community-left'} flex={1}>
            <Stack className={'content-top'} direction="row" alignItems="center" spacing={1} mb={2}>
              <Link href={'/community?articleCategory=NEWS'}>
                <span style={{ fontWeight: 600, fontSize: 22, color: '#c2193c', cursor: 'pointer' }}>News</span>
              </Link>
              <img src="/img/icons/arrowBig.svg" alt="" style={{ width: 24, marginLeft: 8 }} />
            </Stack>
            <Stack className={'card-wrap'} spacing={3}>
              {newsArticles.length > 0 ? (
                newsArticles.map((article, index) => (
                  <CommunityCard vertical={true} article={article} index={index} key={article?._id} />
                ))
              ) : (
                <Typography
                  sx={{
                    color: '#A2A2A2',
                    fontSize: 20,
                    fontWeight: 500,
                    textAlign: 'center',
                    mt: 5,
                  }}
                >
                  There is no news here yet
                </Typography>
              )}
            </Stack>
          </Stack>

          {/* FREE COLUMN */}
          <Stack className={'community-right'} flex={1}>
            <Stack className={'content-top'} direction="row" alignItems="center" spacing={1} mb={2}>
              <Link href={'/community?articleCategory=FREE'}>
                <span style={{ fontWeight: 600, fontSize: 22, color: '#3e60ba', cursor: 'pointer' }}>Free</span>
              </Link>
              <img src="/img/icons/arrowBig.svg" alt="" style={{ width: 24, marginLeft: 8 }} />
            </Stack>
            <Stack className={'card-wrap vertical'} spacing={3}>
              {freeArticles.length > 0 ? (
                freeArticles.map((article, index) => (
                  <CommunityCard vertical={false} article={article} index={index} key={article?._id} />
                ))
              ) : (
                <Typography
                  sx={{
                    color: '#A2A2A2',
                    fontSize: 20,
                    fontWeight: 500,
                    textAlign: 'center',
                    mt: 5,
                  }}
                >
                  There is no news here yet
                </Typography>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CommunityBoards;
