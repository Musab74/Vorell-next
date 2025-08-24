import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Top from '../Top';
import Footer from '../Footer';
import Chat from '../Chat';
import { getJwtToken, updateUserInfo } from '../../auth';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { useTranslation } from 'next-i18next';


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

const withLayoutBasic = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    const router = useRouter();
    const { t } = useTranslation('common');
    const device = useDeviceDetect();

    // keep the reactive var subscribed (ok if unused elsewhere)
    useReactiveVar(userVar);

    /** LIFECYCLES **/
    useEffect(() => {
      const jwt = getJwtToken();
      if (jwt) updateUserInfo(jwt);
    }, []);

    /** ROUTE → HEADER MEDIA MAP (media only) */
    const header = useMemo<HeaderMedia>(() => {
      const path = router.pathname;

      // Direct-playable MP4s
      const AP_VIDEO =
        'https://dynamicmedia.audemarspiguet.com/is/content/audemarspiguet/music_header_RR_1?dpr=off';
      const PATEK_VIDEO =
        'https://patek-res.cloudinary.com/video/upload/f_auto:video/dfsmedia/0906caea301d42b3b8bd23bd656d1711/303765-source/pp-4946r-001-loop-960x1080';
      const OMEGA_DIVER =
        'https://www.omegawatches.co.kr/media/wysiwyg/video/diver300m-desktop.mp4';
      const F1_VIDEO ="https://youtu.be/viQC-6xoJ3E?si=XlpMRi87qJi7EsgW";
      const ROLEX_VIDEO_2 ="https://youtu.be/wrb-eTadsdI?si=FUWVje3EmaXJPHPI";

      // Posters / images
      const WATCHES_POSTER = '/img/banner/watchesPage.png';
      const ROLEX_POSTER = '/img/banner/rolexHeader.jpeg';
      const MYPAGE_POSTER = '/img/banner/mypageHeader.jpeg';

      // Watches & Store pages → Patek video
      if (
        path === '/watches' ||
        path.startsWith('/watch') ||
        path.startsWith('/product') ||
        path === '/store'
      ) {
        return {
          title: 'Watches',
          desc: 'Curated luxury timepieces',
          videoSrc: F1_VIDEO,
          poster: WATCHES_POSTER,
        };
      }

      // Community → AP video
      if (path === '/community' || path.startsWith('/community')) {
        return {
          title: 'Community',
          desc: 'Stories, reviews & guides',
          videoSrc: AP_VIDEO,
          poster: WATCHES_POSTER,
        };
      }

      // My Page → static image header
      if (path === '/mypage') {
        return {
          title: 'My Page',
          desc: 'Your profile & updates',
          videoSrc: ROLEX_VIDEO_2,
          bgImage: MYPAGE_POSTER || WATCHES_POSTER,
        };
      }

      // Account join / login → Omega Diver video (full-bleed)
      if (path === '/account/join') {
        return {
          title: 'Login/Signup',
          desc: 'Authentication Process',
          videoSrc: OMEGA_DIVER,
          poster: '/img/banner/joinBg.svg',
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
          bgImage: ROLEX_POSTER,
        };
      }

      // Default fallback
      return { title: '', desc: '', bgImage: ROLEX_POSTER };
    }, [router.pathname]);

    /** RENDER **/
    if (device === 'mobile') {
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
            className={`header-basic ${header.authHeader ? 'auth' : ''}`}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              ...(header.videoSrc
                ? {}
                : {
                    backgroundImage: `url(${header.bgImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }),
              boxShadow: 'inset 10px 40px 150px 40px rgb(24 22 36 / 85%)',
            }}
          >
            {/* Video background (if provided) */}
            {header.videoSrc && (
              <div
                className="diver-video-bg"
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  left: 0,
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
                  poster={header.poster || '/img/banner/rolexHeader.jpeg'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', // full-bleed with minimal zoom
                    display: 'block',
                  }}
                />
                {/* subtle overlay for legibility */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    background:
                      'linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.55) 60%, rgba(10,10,10,0.65) 100%)',
                  }}
                />
              </div>
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
