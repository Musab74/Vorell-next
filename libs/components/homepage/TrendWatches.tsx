import React, { useMemo, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useQuery } from '@apollo/client';
import { GET_WATCHES } from '../../../apollo/user/query';
import { Watch } from '../../types/watch/watch';

const TrendWatches = () => {
  const device = useDeviceDetect();
  const [showArrows, setShowArrows] = useState(false);

  const API_BASE = useMemo(
    () => (process.env.NEXT_PUBLIC_API_URL || process.env.REACT_APP_API_URL || '').replace(/\/$/, ''),
    []
  );

  const toImageUrl = (p?: string): string => {
    if (!p || p.trim() === '') return '/img/logo/defaultBack.jpeg';
    if (/^https?:\/\//i.test(p)) return p;
    const path = p.startsWith('/') ? p : `/${p}`;
    return `${API_BASE}${path}`;
  };

  const { data } = useQuery(GET_WATCHES, {
    fetchPolicy: 'cache-and-network',
    variables: {
      input: { page: 1, limit: 4, sort: 'watchRank', direction: 'DESC', search: {} },
    },
  });

  const watches: Watch[] = data?.getWatches?.list ?? [];
  if (!watches.length) return null;

  // ===== MOBILE =====
  if (device === 'mobile') {
    return (
      <Stack id="trend-watches-section" sx={{ width: '100%', minHeight: 400, background: '#000', scrollMarginTop: '68px' }}>
        <Swiper
          slidesPerView={1}
          centeredSlides
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          style={{ width: '100%', minHeight: 400 }}
        >
          {watches.map((watch) => {
            const hero = toImageUrl(
              (watch as any).heroImage || watch.images?.[0] || (watch as any).image || (watch as any).thumbnail
            );

            return (
              <SwiperSlide key={watch._id}>
                <div style={{ position: 'relative', width: '100%', minHeight: 400, overflow: 'hidden', background: '#000' }}>
                  <img
                    src={hero}
                    alt={watch.modelName}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', pointerEvents: 'none' }}
                  />
                  <div
                    style={{
                      position: 'relative',
                      zIndex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8,
                      padding: '0 16px 24px',
                      height: '100%',
                      justifyContent: 'flex-end',
                      color: '#fff',
                      textShadow: '0 2px 12px rgba(0,0,0,.35)',
                    }}
                  >
                    <Typography variant="h5" fontWeight={800} style={{ fontSize: 24, color: '#fff' }}>
                      {watch.modelName}
                    </Typography>
                    <Typography style={{ fontSize: 15, color: '#f1f1f1' }}>{watch.description}</Typography>
                    <div style={{ marginTop: 8, fontWeight: 600, fontSize: 14 }}>
                      Discover more <span style={{ fontSize: 18, marginLeft: 4 }}>→</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Stack>
    );
  }

  // ===== DESKTOP =====
  return (
    <Stack
      id="trend-watches-section"
      sx={{
        width: '100%',
        height: '70vh',
        minHeight: 420,
        maxHeight: 780,
        position: 'relative',
        overflow: 'hidden',
        scrollMarginTop: '68px',
        background: '#000',
      }}
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      <WestIcon
        className="swiper-trend-prev"
        sx={{
          position: 'absolute', top: '50%', left: 36, zIndex: 10, width: 46, height: 46, p: 1.2,
          background: '#fff', borderRadius: '50%', boxShadow: '0 4px 20px 0 #00000020', cursor: 'pointer',
          transform: 'translateY(-50%)', opacity: showArrows ? 1 : 0, transition: 'opacity 0.3s',
          display: { xs: 'none', md: 'block' },
        }}
      />
      <EastIcon
        className="swiper-trend-next"
        sx={{
          position: 'absolute', top: '50%', right: 36, zIndex: 10, width: 46, height: 46, p: 1.2,
          background: '#fff', borderRadius: '50%', boxShadow: '0 4px 20px 0 #00000020', cursor: 'pointer',
          transform: 'translateY(-50%)', opacity: showArrows ? 1 : 0, transition: 'opacity 0.3s',
          display: { xs: 'none', md: 'block' },
        }}
      />

      <Swiper
        slidesPerView={1}
        centeredSlides
        modules={[Autoplay, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation={{ nextEl: '.swiper-trend-next', prevEl: '.swiper-trend-prev' }}
        style={{ width: '100%', height: '100%' }}
      >
        {watches.map((watch) => {
          const hero = toImageUrl(
            (watch as any).heroImage || watch.images?.[0] || (watch as any).image || (watch as any).thumbnail
          );

          return (
            <SwiperSlide key={watch._id}>
              <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#000' }}>
                <img
                  src={hero}
                  alt={watch.modelName}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', pointerEvents: 'none' }}
                />
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingLeft: '8vw',
                    color: '#fff',
                    textShadow: '0 2px 14px rgba(0,0,0,.35)',
                  }}
                >
                  <div style={{ maxWidth: 520 }}>
                    <Typography style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.08, fontFamily: 'Playfair Display, serif', color: '#fff' }}>
                      {watch.modelName}
                    </Typography>
                    <Typography style={{ marginTop: 12, fontSize: 20, color: '#f1f1f1' }}>
                      {watch.description}
                    </Typography>
                    <div style={{ marginTop: 16, fontSize: 17, fontWeight: 600, display: 'inline-flex', alignItems: 'center' }}>
                      Discover more <span style={{ fontSize: 19, marginLeft: 5 }}>→</span>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Stack>
  );
};

export default TrendWatches;
