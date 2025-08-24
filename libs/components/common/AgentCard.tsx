// libs/components/common/AgentCard.tsx
import React from 'react';
import { Box, Stack, Typography, Button, IconButton } from '@mui/material';
import Link from 'next/link';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Member } from '../../types/member/member';
import { NEXT_APP_API_URL } from '../../config';

const rolexGreen = '#267147';

interface AgentCardProps {
  store: Member;
  likeMemberHandler: (user: any, id: string) => void | Promise<void>;
}

/** Normalize possibly-relative path to a full URL, with a safe fallback. */
const toMediaUrl = (p?: string | null): string => {
  const FALLBACK = '/img/profile/defaultUser.svg';
  if (!p || p.trim() === '') return FALLBACK;
  if (/^https?:\/\//i.test(p)) return p;           // already absolute
  if (p.startsWith('/img/')) return p;             // public asset
  const base = (NEXT_APP_API_URL || '').replace(/\/$/, '');
  const rel = p.replace(/^\//, '');
  return base ? `${base}/${rel}` : `/${rel}`;
};

const AgentCard: React.FC<AgentCardProps> = ({ store, likeMemberHandler }) => {
  const user = useReactiveVar(userVar);

  // memberImage can be string | string[] | undefined
  const rawImgField = (store as any)?.memberImage;
  const rawImage: string | undefined = Array.isArray(rawImgField)
    ? (rawImgField.find((v: any) => typeof v === 'string' && v.trim() !== '') as string | undefined)
    : typeof rawImgField === 'string'
    ? rawImgField
    : undefined;

  const imagePath = toMediaUrl(rawImage);

  // storeWatches can be number | string | any[]
  const sw: unknown = (store as any)?.storeWatches;
  let watchesCount = 0;
  if (typeof sw === 'number') {
    watchesCount = sw;
  } else if (typeof sw === 'string') {
    const n = Number(sw);
    watchesCount = Number.isFinite(n) ? n : 0;
  } else if (Array.isArray(sw)) {
    watchesCount = (sw as any[]).length;
  }

  // Date label
  const dateStr = store?.createdAt
    ? new Date(store.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });

  return (
    <Box component="div" className="topstore-card">
      {/* Left: image + store name */}
      <Box component="div" className="topstore-imgbox">
        <img
          src={imagePath}
          alt={store?.memberNick || store?.memberFullName || 'Store'}
          className="topstore-img"
          loading="lazy"
          onError={(e: any) => {
            if (e?.currentTarget?.src !== '/img/profile/defaultUser.svg') {
              e.currentTarget.src = '/img/profile/defaultUser.svg';
            }
          }}
        />
        <span className="topstore-imgname">{store?.memberFullName ?? store?.memberNick}</span>
      </Box>

      {/* Right: info */}
      <Stack component="div" className="topstore-infobox">
        <Typography className="topstore-date">{dateStr}</Typography>
        <Typography className="topstore-title">{store?.memberFullName ?? store?.memberNick}</Typography>

        <Stack component="div" direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
          <Typography className="topstore-watches">
            Watches: <span>{watchesCount}</span>
          </Typography>
        </Stack>

        <Link
          href={{ pathname: '/store/detail', query: { storeId: store?._id } }}
          style={{ textDecoration: 'none', marginTop: 18 }}
        >
          <Button
            variant="contained"
            className="topstore-more"
            sx={{
              bgcolor: rolexGreen,
              color: '#fff',
              borderRadius: 50,
              px: 3.2,
              py: 1.2,
              fontWeight: 700,
              fontSize: 17,
              letterSpacing: 0.1,
              textTransform: 'capitalize',
              boxShadow: '0 2px 8px 0 #e5eee9',
              '&:hover': { bgcolor: '#1a5132' },
            }}
          >
            More Info
          </Button>
        </Link>

        {/* Like/views row */}
        <Stack component="div" direction="row" alignItems="center" spacing={2} className="topstore-stats">
          <Stack component="div" direction="row" alignItems="center" spacing={0.8}>
            <RemoveRedEyeIcon sx={{ color: rolexGreen, fontSize: 22 }} />
            <Typography className="topstore-statnum">{store?.memberViews ?? 0}</Typography>
          </Stack>

          <Stack component="div" direction="row" alignItems="center" spacing={0.8}>
            <IconButton
              sx={{ color: rolexGreen, p: '2px' }}
              onClick={() => likeMemberHandler(user, store?._id)}
              aria-label={store?.meLiked?.[0]?.myFavorite ? 'Unlike store' : 'Like store'}
            >
              {store?.meLiked?.[0]?.myFavorite ? (
                <FavoriteIcon sx={{ color: rolexGreen }} />
              ) : (
                <FavoriteBorderIcon sx={{ color: rolexGreen }} />
              )}
            </IconButton>
            <Typography className="topstore-statnum">{store?.memberLikes ?? 0}</Typography>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AgentCard;
