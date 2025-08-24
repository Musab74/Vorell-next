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
  videoSrc?: string;
  poster?: string;
  bgImage?: string;
  authHeader?: boolean;
};

const withLayoutBasic = (Component: React.ComponentType<any>) => {
  return (props: any) => {
    const router = useRouter();
    const { t } = useTranslation('common');
    const device = useDeviceDetect();
    useReactiveVar(userVar);

    useEffect(() => {
      const jwt = getJwtToken();
      if (jwt) updateUserInfo(jwt);
    }, []);

    const header = useMemo<HeaderMedia>(() => {
      const path = router.pathname;

      const AP_VIDEO =
        'https://dynamicmedia.audemarspiguet.com/is/content/audemarspiguet/music_header_RR_1?dpr=off';
      const PATEK_VIDEO =
        'https://patek-res.cloudinary.com/video/upload/f_auto:video/dfsmedia/0906caea301d42b3b8bd23bd656d1711/303765-source/pp-4946r-001-loop-960x1080';
      const OMEGA_DIVER =
        'https://www.omegawatches.co.kr/media/wysiwyg/video/diver300m-desktop.mp4';

      const F1_VIDEO = '/video/F1Video.mp4';
      const ROLEX2_VIDEO = '/video/RolexCham.mp4';

      const WATCHES_POSTER = '/img/banner/watchesPage.png';
      const ROLEX_POSTER = '/img/banner/rolexHeader.jpeg';
      const MYPAGE_POSTER = '/img/banner/mypageHeader.jpeg';

      if (path === '/store') {
        return {
          title: 'Stores',
          desc: 'Find your boutique',
          videoSrc: PATEK_VIDEO,
          poster: WATCHES_POSTER,
        };
      }

      if (path === '/watches' || path.startsWith('/watch') || path.startsWith('/product')) {
        return {
          title: 'Watches',
          desc: 'Curated luxury timepieces',
          videoSrc: ROLEX2_VIDEO,
          poster: WATCHES_POSTER,
        };
      }

      if (path === '/community' || path.startsWith('/community')) {
        return {
          title: 'Community',
          desc: 'Stories, reviews & guides',
          videoSrc: AP_VIDEO,
          poster: WATCHES_POSTER,
        };
      }

      if (path === '/mypage') {
        return {
          title: 'My Page',
          desc: 'Your profile & updates',
          videoSrc: F1_VIDEO,
          poster: MYPAGE_POSTER,
        };
      }

      if (path === '/account/join') {
        return {
          title: 'Login/Signup',
          desc: 'Authentication Process',
          videoSrc: OMEGA_DIVER,
          poster: '/img/banner/joinBg.svg',
          authHeader: true,
        };
      }

      if (path === '/member') {
        return {
          title: 'Member Page',
          desc: 'Explore member activity',
          bgImage: WATCHES_POSTER,
        };
      }

      if (path === '/cs') {
        return {
          title: 'CS',
          desc: 'We are glad to see you again!',
          bgImage: ROLEX_POSTER,
        };
      }

      return { title: '', desc: '', bgImage: ROLEX_POSTER };
    }, [router.pathname]);

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
              height: header.authHeader ? '62vh' : '74vh',
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
            {header.videoSrc && (
              <div
                style={{
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
                  poster={header.poster || '/img/banner/rolexHeader.jpeg'}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transform: 'scale(1.03)',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(10,10,10,0.35) 0%, rgba(10,10,10,0.55) 60%, rgba(10,10,10,0.65) 100%)',
                  }}
                />
              </div>
            )}

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
