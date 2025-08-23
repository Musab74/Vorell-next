import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Head from 'next/head';
import Top from '../Top';
import Footer from '../Footer';
import { Stack, Box } from '@mui/material';
import { getJwtToken, updateUserInfo } from '../../auth';
import Chat from '../Chat';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

type HeaderMedia = {
  title: string;
  desc: string;
  /** if provided, show video as header background; else use bgImage */
  videoSrc?: string;
  poster?: string;
  bgImage?: string;
  /** auth header variant (shrinks height, etc.) */
  authHeader?: boolean;
};

const withLayoutBasic = (Component: any) => {
  return (props: any) => {
    const router = useRouter();
    const { t } = useTranslation('common');
    const device = useDeviceDetect();
    const [authHeader, setAuthHeader] = useState<boolean>(false);
    const user = useReactiveVar(userVar);

    /** LIFECYCLES **/
    useEffect(() => {
      const jwt = getJwtToken();
      if (jwt) updateUserInfo(jwt);
    }, []);

    /** ROUTE → HEADER MEDIA MAP
     *  - AP video for watches-related pages
     *  - Patek video for community-related pages
     *  - MyPage keeps an image banner
     *  - Auth (login/signup) uses compact header
     */
    const header = useMemo<HeaderMedia>(() => {
      const path = router.pathname;

      // Common assets
      const AP_VIDEO =
        'https://dynamicmedia.audemarspiguet.com/is/content/audemarspiguet/music_header_RR_1?dpr=off';
      const PATEK_VIDEO =
        'https://patek-res.cloudinary.com/video/upload/f_auto:video/dfsmedia/0906caea301d42b3b8bd23bd656d1711/303765-source/pp-4946r-001-loop-960x1080';
      const WATCHES_POSTER = '/img/banner/watchesPage.png';

      // Watches pages (handle several possible paths you might use)
      if (
        path === '/watches' ||
        path.startsWith('/watch') ||
        path.startsWith('/product') ||
        path === '/store'
      ) {
        return {
          title: 'Watches',
          desc: 'Curated luxury timepieces',
          videoSrc: PATEK_VIDEO,
          poster: WATCHES_POSTER,
        };
      }

      // Community pages
      if (path === '/community' || path.startsWith('/community')) {
        return {
          title: 'Community',
          desc: 'Stories, reviews & guides',
          videoSrc: AP_VIDEO,
          poster: WATCHES_POSTER,
        };
      }

      // My Page
      if (path === '/mypage') {
        return {
          title: 'My Page',
          desc: 'Your profile & updates',
          bgImage: WATCHES_POSTER,
        };
      }

      // Account join / login
      if (path === '/account/join') {
        setAuthHeader(true);
        return {
          title: 'Login/Signup',
          desc: 'Authentication Process',
          bgImage: '/img/banner/header2.svg',
          authHeader: true,
        };
      }

      // Member profile
      if (path === '/member') {
        return {
          title: 'Member Page',
          desc: 'Explore member activity',
          bgImage: WATCHES_POSTER,
        };
      }

      // CS
      if (path === '/cs') {
        return {
          title: 'CS',
          desc: 'We are glad to see you again!',
          bgImage: '/img/banner/header2.svg',
        };
      }

      // Default fallback
      return {
        title: '',
        desc: '',
        bgImage: '/img/banner/header2.svg',
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.pathname]);

    /** RENDER **/
    if (device === 'mobile') {
      // Mobile layout (you didn’t show a header banner for mobile previously, keeping that)
      return (
        <>
          <Head>
            <title>Vorell</title>
            <meta name="title" content="Vorell" />
          </Head>
          <Stack id="mobile-wrap">
            <Stack id="top">
              <Top />
            </Stack>

            <Stack id="main">
              <Component {...props} />
            </Stack>

            <Stack id="footer">
              <Footer />
            </Stack>
          </Stack>
        </>
      );
    }

    // Desktop layout with video/image header
    return (
      <>
        <Head>
          <title>Vorell</title>
          <meta name="title" content="Vorell" />
        </Head>

        <Stack id="pc-wrap">
          <Stack id="top">
            <Top />
          </Stack>

          <Stack
            className={`header-basic ${authHeader || header.authHeader ? 'auth' : ''}`}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              // When we have a bg image (no video), keep your background image approach:
              ...(header.videoSrc
                ? {}
                : {
                    backgroundImage: `url(${header.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }),
              // soft dark overlay via inset shadow to match your original vibe
              boxShadow: 'inset 10px 40px 150px 40px rgb(24 22 36 / 85%)',
            }}
          >
            {/* Video background (if provided) */}
            {header.videoSrc && (
              <Box
                sx={{
                  position: 'absolute',
                  inset: 0,
                  zIndex: 0,
                  pointerEvents: 'none',
                }}
              >
                <video
                  key={header.videoSrc} 
                  src={header.videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  poster={header.poster || '/img/banner/header2.svg'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                {/* subtle overlay for legibility */}
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.55) 60%, rgba(10,10,10,0.65) 100%)',
                  }}
                />
              </Box>
            )}

            {/* Foreground content */}
            <Stack className="container" sx={{ position: 'relative', zIndex: 1 }}>
              <strong>{t(header.title)}</strong>
              <span>{t(header.desc)}</span>
            </Stack>
          </Stack>

          <Stack id="main">
            <Component {...props} />
          </Stack>

          <Chat />

          <Stack id="footer">
            <Footer />
          </Stack>
        </Stack>
      </>
    );
  };
};

export default withLayoutBasic;
