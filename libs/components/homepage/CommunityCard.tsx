import React, { useMemo } from 'react';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Box } from '@mui/material';
import Moment from 'react-moment';
import { BoardArticle } from '../../types/board-article/board-article';
import { BoardArticleCategory } from '../../enums/board-article.enum';

interface CommunityCardProps {
  vertical: boolean;
  article: BoardArticle;
  index: number;
}

/** Extract the first <img> src from HTML content (TUI/ToastViewer output). */
const getFirstImageFromHtml = (html?: string | null): string | null => {
  if (!html) return null;
  const match = html.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  return match ? match[1] : null;
};

const absolutize = (src: string): string => {
  // If src already absolute, return as-is
  if (/^https?:\/\//i.test(src)) return src;
  // If your images are served from API base, keep using your existing env
  const base = process.env.REACT_APP_API_URL || '';
  if (!base) return src;
  return `${base.replace(/\/$/, '')}/${src.replace(/^\//, '')}`;
};

const categoryLabel = (cat?: BoardArticle['articleCategory']) =>
  cat === BoardArticleCategory.NEWS ? 'News' : 'Free';

const CommunityCard: React.FC<CommunityCardProps> = ({ vertical, article, index }) => {
  const device = useDeviceDetect();

  const imageUrl = useMemo(() => {
    // Preference: first image from content > articleImage > default
    const fromContent = getFirstImageFromHtml((article as any)?.articleContent);
    const chosen =
      fromContent ||
      (article?.articleImage ? `${process.env.REACT_APP_API_URL}/${article.articleImage}` : '') ||
      '/img/event.svg';
    return absolutize(chosen);
  }, [article]);

  if (device === 'mobile') {
    return <div>COMMUNITY CARD (MOBILE)</div>;
  }

  if (vertical) {
    // Vertical “feature-like” card; first item becomes bigger via CSS (:first-child)
    return (
      <Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
        <Box component="div" className="vertical-card" aria-label={`${categoryLabel(article?.articleCategory)} article`}>
          <div className="community-img" style={{ backgroundImage: `url(${imageUrl})` }}>
            <div className="rank-badge">{index + 1}</div>
            <span className={`pill pill-${(article?.articleCategory || 'FREE').toString().toLowerCase()}`}>
              {categoryLabel(article?.articleCategory)}
            </span>
          </div>
          <strong className="title">{article?.articleTitle}</strong>
          <time className="date">
            <Moment format="DD.MM.YY">{article?.createdAt}</Moment>
          </time>
        </Box>
      </Link>
    );
  }

  // Horizontal list item card
  return (
    <Link href={`/community/detail?articleCategory=${article?.articleCategory}&id=${article?._id}`}>
      <Box component="div" className="horizontal-card" aria-label={`${categoryLabel(article?.articleCategory)} article`}>
        <div className="thumb">
          <img src={imageUrl} alt={article?.articleTitle || 'Article image'} />
        </div>
        <div className="meta">
          <strong className="title">{article?.articleTitle}</strong>
          <div className="sub">
            <span className={`pill pill-${(article?.articleCategory || 'FREE').toString().toLowerCase()}`}>
              {categoryLabel(article?.articleCategory)}
            </span>
            <time className="date">
              <Moment format="DD.MM.YY">{article?.createdAt}</Moment>
            </time>
          </div>
        </div>
      </Box>
    </Link>
  );
};

export default CommunityCard;
