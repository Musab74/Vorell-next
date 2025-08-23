import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Stack, Typography, Box, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL, topWatchRank } from '../../config';
import { Watch } from '../../types/watch/watch';

interface WatchCardProps {
  watch: Partial<Watch>;
  likeWatchHandler?: (user: any, id: string) => void;
  myFavorites?: boolean;      // we’re on favorites page?
  recentlyVisited?: boolean;
}

const WatchCard = ({ watch, likeWatchHandler, myFavorites, recentlyVisited }: WatchCardProps) => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);

  // derived fields
  const brand = (watch.brand as any) || (watch as any)?.brandName || '';
  const modelName = watch.modelName || (watch as any)?.model || '';
  const origin = watch.watchOrigin ?? '';
  const movement = watch.movement ?? '';
  const caseDiameter = watch.caseDiameter ? `${watch.caseDiameter} mm` : '';
  const waterRes = watch.waterResistance ? `${watch.waterResistance}m` : '';
  const isTop = (watch.rank ?? 0) > topWatchRank;

  // image
  const firstImg = Array.isArray(watch.images) ? watch.images?.[0] : (watch as any)?.image;
  const initialSrc = firstImg ? `${REACT_APP_API_URL}/${firstImg}` : '/img/banner/header1.svg';
  const [imgSrc, setImgSrc] = useState(initialSrc);

  // ===== Like UI (frontend-only) =====
  // Use server meLiked when present; on Favorites page, default to liked=true for filled heart
  const initialLiked = useMemo(
    () => Boolean(watch.meLiked?.[0]?.myFavorite) || !!myFavorites,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [myFavorites, watch.meLiked]
  );
  const [liked, setLiked] = useState<boolean>(initialLiked);
  const [likesCnt, setLikesCnt] = useState<number>(watch.likes ?? 0);

  // sync when parent refetches
  useEffect(() => {
    const serverLiked = Boolean(watch.meLiked?.[0]?.myFavorite);
    setLiked(serverLiked || !!myFavorites);
    if (typeof watch.likes === 'number') setLikesCnt(watch.likes);
  }, [myFavorites, watch.meLiked, watch.likes]);

  const onLikeClick = () => {
    if (!watch._id) return;
    // optimistic flip for icon + count
    setLiked((prev) => !prev);
    setLikesCnt((c) => (liked ? Math.max(0, c - 1) : c + 1));
    likeWatchHandler?.(user, String(watch._id));
  };

  if (device === 'mobile') return <div>WATCH CARD</div>;

  return (
    <Stack className="card-config">
      <Stack className="top">
        <Link href={{ pathname: '/watches/detail', query: { id: watch._id } }} style={{ display: 'block', width: '100%', height: '100%' }}>
          <img src={imgSrc} alt="" onError={() => setImgSrc('/img/banner/header1.svg')} />
        </Link>

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

      {/* bottom */}
      <Stack className="bottom">
        <Stack className="name-address">
          <Stack className="name">
            <Link href={{ pathname: '/watches/detail', query: { id: watch._id } }}>
              <Typography>{`${brand} ${modelName}`.trim()}</Typography>
            </Link>
          </Stack>
          <Stack className="address">
            <Typography>{origin}</Typography>
          </Stack>
        </Stack>

        <Stack className="options">
          <Stack className="option">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b69c70" strokeWidth="2">
              <path d="M12 1v3" /><circle cx="12" cy="12" r="9" /><path d="M12 7v5l4 2" />
            </svg>
            <Typography>{movement || '-'}</Typography>
          </Stack>
          <Stack className="option">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b69c70" strokeWidth="2">
              <rect x="4" y="8" width="16" height="8" rx="2" /><path d="M12 8v8" />
            </svg>
            <Typography>{caseDiameter || '-'}</Typography>
          </Stack>
          <Stack className="option">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b69c70" strokeWidth="2">
              <path d="M12 2S4 14 4 18a8 8 0 0 0 16 0c0-4-8-16-8-16z" />
            </svg>
            <Typography>{waterRes || '-'}</Typography>
          </Stack>
        </Stack>

        <Stack className="divider" />

        <Stack className="type-buttons">
          <Stack className="type">
            {watch.isLimitedEdition ? (
              <Typography sx={{ fontWeight: 500, fontSize: '13px', color: '#b69c70' }}>Limited Version</Typography>
            ) : null}
          </Stack>

          {!recentlyVisited && (
            <Stack className="buttons">
              <IconButton color="default"><RemoveRedEyeIcon /></IconButton>
              <Typography className="view-cnt">{watch.watchViews ?? 0}</Typography>

              <IconButton color="default" onClick={onLikeClick}>
                {liked ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon />}
              </IconButton>
              <Typography className="view-cnt">{likesCnt}</Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default WatchCard;
