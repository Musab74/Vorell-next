import React, { useMemo, useState } from 'react';
import { Link, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useQuery } from '@apollo/client';
import { GET_WATCHES } from '../../../apollo/user/query';
import { Watch } from '../../types/watch/watch';
import NextLink from 'next/link';


const TopStores = () => {
  const device = useDeviceDetect();
  const [showArrows, setShowArrows] = useState(false);
  const theme = useTheme();
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));

  const API_BASE = useMemo(() => {
    const base = (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_APP_API_URL || '').trim();
    return base.endsWith('/') ? base.slice(0, -1) : base;
  }, []);

  const toImageUrl = (raw?: unknown): string => {
    const candidate =
      (typeof raw === 'string' && raw) ||
      (raw && typeof (raw as any).url === 'string' && (raw as any).url) ||
      '';
    if (!candidate) return '/img/logo/defaultBack.jpeg';
    const p = candidate.replace(/\\/g, '/').trim();
    if (/^https?:\/\//i.test(p)) return p;
    const prefixed = p.startsWith('/') ? p : `/${p}`;
    return API_BASE ? `${API_BASE}${prefixed}` : prefixed;
  };

  const { data } = useQuery(GET_WATCHES, {
    fetchPolicy: 'cache-and-network',
    variables: {
      input: { page: 1, limit: 4, sort: 'watchRank', direction: 'DESC', search: {} },
    },
  });

  const watches: Watch[] = data?.getWatches?.list ?? [];
  if (!watches.length) return null;

  const slideHeight = mdUp ? '85vh' : '530px';
  const slidePl = mdUp ? '8vw' : '16px';
  const titleSize = mdUp ? 44 : 30;
  const descSize = mdUp ? 22 : 16;

  // MOBILE
  if (device === 'mobile') {
    return (
      <Stack id="trend-watches-section" sx={{ width: '100%', minHeight: 400, background: '#000', scrollMarginTop: '68px' }}>
        <Swiper
          slidesPerView={1}
          centeredSlides
          modules={[Autoplay]}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          style={{ width: '100%', height: '85vh' }}
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
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      pointerEvents: 'none',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,.55) 15%, rgba(0,0,0,0) 45%)',
                    }}
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
                    <a
                      href="/watches"
                      style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "inline-block",
                        marginTop: 8,
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      Discover more{" "}
                      <span style={{ fontSize: 18, marginLeft: 4 }}>→</span>
                    </a>

                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Stack>
    );
  }

  // DESKTOP
  return (
    <Stack
      id="trend-watches-section"
      sx={{
        width: '100%',
        height: '85vh',
        minHeight: 420,
        maxHeight: 900,
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
          position: 'absolute',
          top: '50%',
          left: 36,
          zIndex: 10,
          width: 46,
          height: 46,
          p: 1.2,
          background: '#fff',
          borderRadius: '50%',
          boxShadow: '0 4px 20px 0 #00000020',
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
          boxShadow: '0 4px 20px 0 #00000020',
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
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    pointerEvents: 'none',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(90deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.20) 35%, rgba(0,0,0,0) 60%)',
                  }}
                />
                <div
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    paddingLeft: slidePl,
                    color: '#fff',
                    textShadow: '0 2px 14px rgba(0,0,0,.35)',
                  }}
                >
                  <div style={{ maxWidth: 520 }}>
                    <Typography style={{ fontSize: 44, fontWeight: 800, lineHeight: 1.08, fontFamily: 'Playfair Display, serif', color: '#fff' }}>
                      {watch.modelName}
                    </Typography>
                    <Typography style={{ marginTop: 12, fontSize: descSize, color: '#f1f1f1' }}>
                      {watch.description}
                    </Typography>
                    <NextLink
                      href={{ pathname: '/watches/detail', query: { id: watch._id } }}
                      style={{ textDecoration: 'none' }}
                    >
                      <div
                        style={{
                          marginTop: 16,
                          fontSize: 17,
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          cursor: 'pointer',        // mouse pointer
                          color: '#b69c70'          // luxury accent
                        }}
                      >
                        Discover more <span style={{ fontSize: 19, marginLeft: 5 }}>→</span>
                      </div>
                    </NextLink>

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

export default TopStores;
