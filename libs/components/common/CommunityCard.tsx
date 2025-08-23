import React from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Stack, Typography, IconButton } from '@mui/material';
import Moment from 'react-moment';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { BoardArticle } from '../../types/board-article/board-article';
import { REACT_APP_API_URL } from '../../config';
import { T } from '../../types/common';

interface CommunityCardProps {
  boardArticle: BoardArticle;
  size?: 'small' | 'normal';
  likeArticleHandler: any;
}

const CommunityCard = ({ boardArticle, size = 'normal', likeArticleHandler }: CommunityCardProps) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);

  const imagePath =
    boardArticle?.articleImage
      ? `${REACT_APP_API_URL}/${boardArticle.articleImage}`
      : '/img/community/communityImg.png';

  const chooseArticleHandler = (e: React.SyntheticEvent) => {
    router.push(
      {
        pathname: '/community/detail',
        query: { articleCategory: boardArticle?.articleCategory, id: boardArticle?._id },
      },
      undefined,
      { shallow: true }
    );
  };

  const goMemberPage = (id?: string) => {
    if (!id) return;
    if (id === user?._id) router.push('/mypage');
    else router.push(`/member?memberId=${id}`);
  };

  if (device === 'mobile') {
    // Use the same card; responsive styles below handle mobile.
  }

  return (
    <Stack
      className={`community-card ${size}`}
      onClick={chooseArticleHandler}
      role="button"
      tabIndex={0}
    >
      {/* IMAGE */}
      <div className="image-box">
        <img src={imagePath} alt={boardArticle?.articleTitle || 'article image'} className="card-img" />
        <div className="img-overlay" />
        {/* Date badge */}
        <div className="date-badge">
          <div className="month">
            <Moment format="MMM">{boardArticle?.createdAt}</Moment>
          </div>
          <div className="day">
            <Moment format="DD">{boardArticle?.createdAt}</Moment>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="content">
        <div className="meta">
          <Typography
            className="author"
            onClick={(e:T) => {
              e.stopPropagation();
              goMemberPage(boardArticle?.memberData?._id as string);
            }}
            title="View member"
          >
            {boardArticle?.memberData?.memberNick}
          </Typography>
          <div className="stats">
            <RemoveRedEyeIcon className="icon" />
            <span className="count">{boardArticle?.articleViews ?? 0}</span>
            <IconButton
              className="like-btn"
              size="small"
              onClick={(e:T) => {
                e.stopPropagation();
                likeArticleHandler(e, user, boardArticle._id);
              }}
              aria-label="like"
            >
              {boardArticle?.meLiked && boardArticle?.meLiked[0]?.myFavorite ? (
                <FavoriteIcon className="heart active" />
              ) : (
                <FavoriteBorderIcon className="heart" />
              )}
            </IconButton>
            <span className="count">{boardArticle?.articleLikes ?? 0}</span>
          </div>
        </div>

        <Typography className="title" title={boardArticle?.articleTitle}>
          {boardArticle?.articleTitle}
        </Typography>
      </div>
    </Stack>
  );
};

export default CommunityCard;
