import React, { useState } from 'react';
import { Stack, Box, IconButton, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useQuery } from '@apollo/client';
import { GET_WATCHES } from '../../../apollo/user/query';
import { Watch } from '../../types/watch/watch';

const TrendWatches = () => {
  const device = useDeviceDetect();
  const [showArrows, setShowArrows] = useState(false);

  const { data } = useQuery(GET_WATCHES, {
    fetchPolicy: 'cache-and-network',
    variables: {
      input: {
        page: 1,
        limit: 4,
        sort: 'watchRank',
        direction: 'DESC',
        search: {},
      },
    },
  });

  const watches: Watch[] = data?.getWatches?.list ?? [];

  if (!watches.length) return null;

  // MOBILE VERSION
  if (device === 'mobile') {
    return (
      <Stack
        id="trend-watches-section"
        sx={{
          width: '100%',
          minHeight: 400,
          background: '#f4f8fc',
          scrollMarginTop: '68px',
        }}
      >
        <Swiper
          slidesPerView={1}
          centeredSlides
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          style={{ width: '100%', minHeight: 400 }}
        >
          {watches.map((watch) => (
            <SwiperSlide key={watch._id}>
              <Box
                sx={{
                  width: '100%',
                  minHeight: 400,
                  background: `url(${watch.images?.[0] || '/img/logo/Vorell-gold.png'}) center center / cover no-repeat`,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-start',
                  px: 2,
                  pb: 4,
                }}
              >
                <Box
                  sx={{
                    background: 'rgba(255,255,255,0.94)',
                    p: 2.2,
                    borderRadius: 3,
                    boxShadow: '0 2px 18px #eee',
                    maxWidth: 340,
                    width: '95%',
                  }}
                >
                  <Typography variant="h5" fontWeight={800} sx={{ fontSize: 24 }}>
                    {watch.modelName}
                  </Typography>
                  <Typography color="#444" sx={{ fontSize: 15, mt: 0.7 }}>
                    {watch.description}
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1.8 }}>
                    <Typography fontWeight={700} sx={{ fontSize: 19 }}>
                      {watch.price ? `$${watch.price}` : ''}
                    </Typography>
                    {/* Uncomment below for like icon */}
                    {/* <IconButton size="small" sx={{ ml: 0.5, color: '#C3913C' }}>
                      <FavoriteBorderIcon />
                    </IconButton>
                    <Typography variant="body2" fontWeight={600}>
                      {watch.likes}
                    </Typography> */}
                  </Stack>
                  <Box sx={{ mt: 1.6, fontWeight: 600, fontSize: 14 }}>
                    Discover more <span style={{ fontSize: 18, marginLeft: 4 }}>→</span>
                  </Box>
                </Box>
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>
      </Stack>
    );
  }

  // DESKTOP VERSION
  return (
    <Stack
      id="trend-watches-section"
      sx={{
        width: '100%',
        height: { xs: 420, md: '70vh' },
        minHeight: 420,
        maxHeight: 780,
        position: 'relative',
        overflow: 'hidden',
        scrollMarginTop: '68px',
      }}
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <WestIcon
        className="swiper-trend-prev"
        sx={{
          position: 'absolute',
          top: '50%',
          left: 36,
          zIndex: 10,
          width: 46,
          height: 46,
          p: 1.2,
          background: '#fff',
          borderRadius: '50%',
          boxShadow: '0 4px 20px 0 #e1eaf3',
          cursor: 'pointer',
          transform: 'translateY(-50%)',
          opacity: showArrows ? 1 : 0,
          transition: 'opacity 0.3s',
          display: { xs: 'none', md: 'block' },
        }}
      />
      <EastIcon
        className="swiper-trend-next"
        sx={{
          position: 'absolute',
          top: '50%',
          right: 36,
          zIndex: 10,
          width: 46,
          height: 46,
          p: 1.2,
          background: '#fff',
          borderRadius: '50%',
          boxShadow: '0 4px 20px 0 #e1eaf3',
          cursor: 'pointer',
          transform: 'translateY(-50%)',
          opacity: showArrows ? 1 : 0,
          transition: 'opacity 0.3s',
          display: { xs: 'none', md: 'block' },
        }}
      />

      <Swiper
        slidesPerView={1}
        centeredSlides
        modules={[Autoplay, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation={{
          nextEl: '.swiper-trend-next',
          prevEl: '.swiper-trend-prev',
        }}
        style={{ width: '100%', height: '100%' }}
      >
        {watches.map((watch) => (
          <SwiperSlide key={watch._id}>
            <Box
              sx={{
                width: '100%',
                height: { xs: 420, md: '70vh' },
                minHeight: 420,
                maxHeight: 780,
                position: 'relative',
                background: `url(${
                  watch.images?.[0] && watch.images[0] !== ''
                    ? watch.images[0]
                    : '/img/logo/defaultBack.jpeg'
                }) center center / cover no-repeat`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                pl: { xs: 2, md: 12 },
              }}
            >
              {/* Overlay for readability */}
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(90deg,rgba(255,255,255,0.93) 0%,rgba(255,255,255,0.65) 50%,rgba(255,255,255,0.20) 100%)',
                  zIndex: 1,
                }}
              />
              {/* Card content */}
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 2,
                  maxWidth: { xs: 350, md: 500 },
                  mb: { xs: 4, md: 0 },
                  px: { xs: 1, md: 0 },
                }}
              >
                <Typography
                  sx={{
                    fontSize: { xs: 30, md: 44 },
                    fontWeight: 800,
                    lineHeight: 1.08,
                    fontFamily: 'Playfair Display, serif',
                    color: '#191919',
                  }}
                >
                  {watch.modelName}
                </Typography>
                <Typography
                  sx={{
                    mt: 1.2,
                    fontSize: { xs: 16, md: 22 },
                    fontWeight: 400,
                    color: '#444',
                  }}
                >
                  {watch.description}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 2.3 }}>
                  <Typography
                    sx={{
                      fontSize: { xs: 20, md: 28 },
                      fontWeight: 700,
                      color: '#111',
                    }}
                  >
                    {watch.price ? `$${watch.price}` : ''}
                  </Typography>
                  {/* Uncomment below for like icon */}
                  {/* <IconButton sx={{ ml: 0.5, color: '#C3913C', fontSize: 26 }}>
                    <FavoriteBorderIcon />
                  </IconButton>
                  <Typography variant="body2" fontWeight={600}>
                    {watch.likes}
                  </Typography> */}
                </Stack>
                <Box
                  sx={{
                    mt: 2,
                    fontSize: 17,
                    fontWeight: 600,
                    color: '#222',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  Discover more <span style={{ fontSize: 19, marginLeft: 5 }}>→</span>
                </Box>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Stack>
  );
};

export default TrendWatches;
