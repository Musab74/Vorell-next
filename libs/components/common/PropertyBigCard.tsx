// libs/components/common/PropertyBigCard.tsx
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Watch } from '../../types/watch/watch';
import { REACT_APP_API_URL } from '../../config';
import { T } from '../../types/common';

interface PropertyBigCardProps {
  watch: Watch;
  user: T;
  likeWatchHandler: (user: T, id: string) => Promise<void>;
}

/* ---- styles (typed) ---- */
const cardSx: SxProps<Theme> = {
  width: 340,
  minHeight: 500,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  background: 'none',
  p: 0,
  m: '0 auto',
  fontFamily: `'Inter', 'Playfair Display', serif`,
};

const imgWrapSx: SxProps<Theme> = {
  width: 210,
  height: 275,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  mb: 2.5,
};

const likeRowSx: SxProps<Theme> = { mt: 4 };

const likeBtnSx: SxProps<Theme> = {
  color: '#267147',
  mr: 1,
  p: 0.5,
  '&:hover': { color: '#1c5132', background: 'transparent' },
};

const likeTextSx: SxProps<Theme> = {
  color: '#267147',
  fontWeight: 500,
  fontSize: 18,
  ml: 0.6,
  verticalAlign: 'middle',
  fontFamily: `'Inter', serif`,
  letterSpacing: 0.2,
  userSelect: 'none',
};

const refTextSx: SxProps<Theme> = {
  fontSize: 20,
  fontWeight: 400,
  letterSpacing: 2,
  textAlign: 'center',
  color: '#757575',
  mb: 1,
  mt: 1,
  textTransform: 'uppercase',
  fontFamily: `'Inter', 'Playfair Display', serif`,
};

const modelTextSx: SxProps<Theme> = {
  fontSize: 22,
  fontWeight: 600,
  color: '#2e2f30',
  letterSpacing: 1.5,
  textAlign: 'center',
  textTransform: 'uppercase',
  mb: 1,
  fontFamily: `'Playfair Display', serif`,
};

const metaTextSx: SxProps<Theme> = {
  fontSize: 15,
  color: '#7e7e7e',
  textAlign: 'center',
  letterSpacing: 0.5,
  fontFamily: `'Inter', serif`,
};

const PropertyBigCard: React.FC<PropertyBigCardProps> = ({ watch, user, likeWatchHandler }) => {
  const imageSrc = watch?.images?.[0];
  const mainImage =
    imageSrc && imageSrc.trim() !== ''
      ? `${REACT_APP_API_URL}/${imageSrc}`
      : '/img/logo/RolexStore.jpeg';

  const isLiked = Boolean(watch?.meLiked?.[0]?.myFavorite);

  const handleLike = () => {
    if (!watch?._id) return;
    void likeWatchHandler(user, watch._id);
  };

  return (
    <Box component="div" sx={cardSx}>
      {/* Watch Image */}
      <Box component="div" sx={imgWrapSx}>
        <img
          src={mainImage}
          alt={watch?.modelName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            background: 'transparent',
          }}
        />
      </Box>

      {/* Reference / Brand */}
      <Typography sx={refTextSx}>
        {watch?.brand || watch?._id || ''}
      </Typography>

      {/* Model Name */}
      <Typography sx={modelTextSx}>
        {watch?.modelName}
      </Typography>

      {/* Meta */}
      <Typography sx={metaTextSx}>
        {watch?.caseDiameter || watch?.watchOrigin || watch?.waterResistance || ''}
      </Typography>

      {/* Favorite */}
      <Box component="div" sx={likeRowSx}>
        <IconButton
          aria-label="add to favorites"
          onClick={handleLike}
          sx={likeBtnSx}
          disabled={!user?._id || !watch?._id}
        >
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography component="span" sx={likeTextSx}>
          Add to favorites
        </Typography>
      </Box>
    </Box>
  );
};

export default PropertyBigCard;
