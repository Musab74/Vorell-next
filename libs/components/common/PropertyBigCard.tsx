import React, { useState } from 'react';
import { Box, Typography, Stack, IconButton } from '@mui/material';
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

const PropertyBigCard: React.FC<PropertyBigCardProps> = ({ watch, user, likeWatchHandler }) => {
  const [isHovered, setIsHovered] = useState(false);

  const imageSrc = watch?.images?.[0];
const mainImage =
  imageSrc && imageSrc.trim() !== ""
    ? `${REACT_APP_API_URL}/${imageSrc}`
    : '/img/logo/RolexStore.jpeg';


  const isLiked = watch?.meLiked?.[0]?.myFavorite;

  return (
    <Box
      sx={{
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
      }}
    >
      {/* Watch Image */}
      <Box
        sx={{
          width: 210,
          height: 275,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'none',
          mb: 2.5,
        }}
      >
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

      {/* Reference Number (uppercase, thin font) */}
      <Typography
        sx={{
          fontSize: 20,
          fontWeight: 400,
          letterSpacing: 2,
          textAlign: 'center',
          color: '#757575',
          mb: 1,
          mt: 1,
          textTransform: 'uppercase',
          fontFamily: `'Inter', 'Playfair Display', serif`,
        }}
      >
        {watch?.brand || watch?._id || ''}
      </Typography>

      {/* Model Name (uppercase, larger, spaced) */}
      <Typography
        sx={{
          fontSize: 22,
          fontWeight: 600,
          color: '#2e2f30',
          letterSpacing: 1.5,
          textAlign: 'center',
          textTransform: 'uppercase',
          mb: 1,
          fontFamily: `'Playfair Display', serif`,
        }}
      >
        {watch?.modelName}
      </Typography>

      {/* Material/Color (optional) */}
      <Typography
        sx={{
          fontSize: 15,
          color: '#7e7e7e',
          textAlign: 'center',
          letterSpacing: 0.5,
          fontFamily: `'Inter', serif`,
        }}
      >
        {watch?.caseDiameter || watch?.watchOrigin || watch?.waterResistance || ''}
      </Typography>

      {/* Add to favorites button (green like Rolex/Patek) */}
      <Box sx={{ mt: 4 }}>
        <IconButton
          aria-label="add to favorites"
          onClick={() => likeWatchHandler(user, watch._id!)}
          sx={{
            color: isLiked ? '#267147' : '#267147', // Always green
            mr: 1,
            p: 0.5,
            '&:hover': { color: '#1c5132', background: 'transparent' },
          }}
          disabled={!user?._id}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography
          component="span"
          sx={{
            color: '#267147',
            fontWeight: 500,
            fontSize: 18,
            ml: 0.6,
            verticalAlign: 'middle',
            fontFamily: `'Inter', serif`,
            letterSpacing: 0.2,
            userSelect: 'none',
          }}
        >
          Add to favorites
        </Typography>
      </Box>
    </Box>
  );
};

export default PropertyBigCard;
