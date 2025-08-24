import React, { useState } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography } from '@mui/material';
import CommunityCard from './CommunityCard';
import { BoardArticle } from '../../types/board-article/board-article';
import { GET_BOARD_ARTICLES } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { BoardArticleCategory } from '../../enums/board-article.enum';

const CommunityBoards: React.FC = () => {
  const device = useDeviceDetect();

  const [searchCommunity] = useState({
    page: 1,
    sort: 'articleViews',
    direction: 'DESC',
  });

  const [newsArticles, setNewsArticles] = useState<BoardArticle[]>([]);
  const [freeArticles, setFreeArticles] = useState<BoardArticle[]>([]);

  /** APOLLO REQUESTS **/
  const {
    loading: getNewsArticlesLoading,
    error: getNewsArticlesError,
  } = useQuery(GET_BOARD_ARTICLES, {
    fetchPolicy: 'network-only',
    variables: {
      input: {
        ...searchCommunity,
        limit: 6,
        search: { articleCategory: BoardArticleCategory.NEWS },
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => setNewsArticles(data?.getBoardArticles?.list || []),
  });

  const {
    loading: getFreeArticlesLoading,
    error: getFreeArticlesError,
  } = useQuery(GET_BOARD_ARTICLES, {
    fetchPolicy: 'network-only',
    variables: {
      input: {
        ...searchCommunity,
        limit: 6,
        search: { articleCategory: BoardArticleCategory.FREE },
      },
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => setFreeArticles(data?.getBoardArticles?.list || []),
  });

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

  // MOBILE – minimal message (you can enhance later if you want)
  if (device === 'mobile') {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
        <Typography variant="h6" color="text.secondary">
          COMMUNITY BOARDS (MOBILE)
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack className="community-board" id="news-section">
      <Stack className="container">
        <Stack className="header">
          <Typography component="h1" className="title">
            Community Board Highlights
          </Typography>
          <span className="accent-line" />
        </Stack>

        <Stack className="community-main" direction="row" spacing={5}>
          {/* NEWS COLUMN (Feature + list) */}
          <Stack className="community-left" flex={1}>
            <Stack className="content-top" direction="row" alignItems="center" spacing={1} mb={2}>
              <Link href={'/community?articleCategory=NEWS'}>
                <span className="section-link section-news">News</span>
              </Link>
              <img src="/img/icons/arrowBig.svg" alt="" className="arrow-icon" />
            </Stack>

            <Stack className="card-wrap" spacing={3}>
              {newsArticles.length > 0 ? (
                newsArticles.map((article, index) => (
                  <CommunityCard vertical={true} article={article} index={index} key={article?._id} />
                ))
              ) : (
                <Typography className="empty">There is no news here yet</Typography>
              )}
            </Stack>
          </Stack>

          {/* FREE COLUMN (Clean list) */}
          <Stack className="community-right" flex={1}>
            <Stack className="content-top" direction="row" alignItems="center" spacing={1} mb={2}>
              <Link href={'/community?articleCategory=FREE'}>
                <span className="section-link section-free">Free</span>
              </Link>
              <img src="/img/icons/arrowBig.svg" alt="" className="arrow-icon" />
            </Stack>

            <Stack className="card-wrap vertical" spacing={3}>
              {freeArticles.length > 0 ? (
                freeArticles.map((article, index) => (
                  <CommunityCard vertical={false} article={article} index={index} key={article?._id} />
                ))
              ) : (
                <Typography className="empty">There is no news here yet</Typography>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CommunityBoards;
