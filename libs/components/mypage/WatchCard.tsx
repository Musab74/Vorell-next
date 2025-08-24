// libs/components/mypage/WatchCard.tsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Stack, Typography, Box, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { formatterStr } from '../../utils';
import { NEXT_APP_API_URL, topWatchRank } from '../../config';
import { Watch } from '../../types/watch/watch';

interface WatchCardProps {
  watch: Partial<Watch>;
  likeWatchHandler?: (user: any, id: string) => void | Promise<void>;
  myFavorites?: boolean;
  recentlyVisited?: boolean;
  onOpenDetail?: (id: string) => void | Promise<void>;
}

const tag = '[MyPage/WatchCard]';

const WatchCard = ({
  watch,
  likeWatchHandler,
  myFavorites,
  recentlyVisited,
  onOpenDetail,
}: WatchCardProps) => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);

  // Derived display fields
  const brand = watch.brand ?? '';
  const modelName = watch.modelName ?? '';
  const origin = watch.watchOrigin ?? '';
  const movement = watch.movement ?? '';
  const caseDiameter = watch.caseDiameter ? `${watch.caseDiameter} mm` : '';
  const waterRes = watch.waterResistance ? `${watch.waterResistance}m` : '';
  const isTop = (watch.rank ?? 0) > topWatchRank;

  // Heart filled state (favorites page forces it true)
  const liked = useMemo(
    () => Boolean(myFavorites || watch.meLiked?.[0]?.myFavorite),
    [myFavorites, watch.meLiked]
  );

  const API = NEXT_APP_API_URL || process.env.NEXT_APP_API_URL || '';
  const firstImg = Array.isArray(watch.images) && watch.images[0] ? watch.images[0] : '';
  const [imgSrc, setImgSrc] = useState(firstImg ? `${API}/${firstImg}` : '/img/watches/placeholder.png');

  useEffect(() => {
    // Helpful when debugging card state
    // console.log(`${tag}`, { id: watch._id, likes: watch.likes, views: watch.watchViews, liked });
  }, [watch._id, watch.likes, watch.watchViews, liked]);

  const openDetail = useCallback(async () => {
    if (onOpenDetail && watch._id) {
      try {
        await onOpenDetail(watch._id);
      } catch (e) {
        console.warn(`${tag} openDetail error`, e);
      }
    }
  }, [onOpenDetail, watch._id]);

  const onLikeClick = useCallback(() => {
    if (likeWatchHandler && watch._id) {
      likeWatchHandler(user, watch._id);
    } else if (!likeWatchHandler) {
      console.warn(`${tag} likeWatchHandler missing; heart click does nothing`);
    }
  }, [likeWatchHandler, user, watch._id]);

  if (device === 'mobile') {
    return <div>WATCH CARD</div>;
  }

  return (
    <Stack component="div" className="card-config">
      {/* TOP */}
      <Stack component="div" className="top">
        {onOpenDetail ? (
          <a style={{ display: 'block', width: '100%', height: '100%' }} onClick={openDetail}>
            <img
              src={imgSrc}
              alt={`${brand} ${modelName}`}
              onError={() => {
                setImgSrc('/img/watches/placeholder.png');
              }}
            />
          </a>
        ) : (
          <Link
            href={{ pathname: '/watches/detail', query: { id: watch._id } }}
            style={{ display: 'block', width: '100%', height: '100%' }}
          >
            <img
              src={imgSrc}
              alt={`${brand} ${modelName}`}
              onError={() => {
                setImgSrc('/img/watches/placeholder.png');
              }}
            />
          </Link>
        )}

        {isTop && (
          <Box component="div" className="top-badge">
            <img src="/img/icons/electricity.svg" alt="" />
            <Typography>TOP</Typography>
          </Box>
        )}

        <Box component="div" className="price-box">
          <Typography>${formatterStr(watch.price ?? 0)}</Typography>
        </Box>
      </Stack>

      {/* BOTTOM */}
      <Stack component="div" className="bottom">
        <Stack component="div" className="name-address">
          <Stack component="div" className="name">
            {onOpenDetail ? (
              <a onClick={openDetail}>
                <Typography>{`${brand} ${modelName}`.trim()}</Typography>
              </a>
            ) : (
              <Link href={{ pathname: '/watches/detail', query: { id: watch._id } }}>
                <Typography>{`${brand} ${modelName}`.trim()}</Typography>
              </Link>
            )}
          </Stack>
          <Stack component="div" className="address">
            <Typography>{origin}</Typography>
          </Stack>
        </Stack>

        {/* SPECS */}
        <Stack component="div" className="options">
          <Stack component="div" className="option">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b69c70" strokeWidth="2">
              <path d="M12 1v3" />
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l4 2" />
            </svg>
            <Typography>{movement || '-'}</Typography>
          </Stack>

          <Stack component="div" className="option">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b69c70" strokeWidth="2">
              <rect x="4" y="8" width="16" height="8" rx="2" />
              <path d="M12 8v8" />
            </svg>
            <Typography>{caseDiameter || '-'}</Typography>
          </Stack>

          <Stack component="div" className="option">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b69c70" strokeWidth="2">
              <path d="M12 2S4 14 4 18a8 8 0 0 0 16 0c0-4-8-16-8-16z" />
            </svg>
            <Typography>{waterRes || '-'}</Typography>
          </Stack>
        </Stack>

        <Stack component="div" className="divider" />

        <Stack component="div" className="type-buttons">
          <Stack component="div" className="type">
            {watch.isLimitedEdition ? (
              <Typography sx={{ fontWeight: 500, fontSize: '13px', color: '#b69c70' }}>
                Limited Version
              </Typography>
            ) : null}
          </Stack>

          {!recentlyVisited && (
            <Stack component="div" className="buttons">
              <IconButton color="default" onClick={openDetail}>
                <RemoveRedEyeIcon />
              </IconButton>
              <Typography className="view-cnt">{(watch.watchViews ?? 0).toLocaleString()}</Typography>

              <IconButton color="default" onClick={onLikeClick}>
                {liked ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
              </IconButton>
              <Typography className="view-cnt">{(watch.likes ?? 0).toLocaleString()}</Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default WatchCard;
