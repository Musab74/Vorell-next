// libs/components/layout/HeaderVideo.tsx
import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';

// Video sources (no leading spaces)
const videoSources = [
  'https://media.rolex.com/video/upload/c_limit,w_2880/f_auto:video/q_auto:eco/v1/rolexcom/new-watches/2025/hub/videos/autoplay/cover/rolex-watches-new-watches-2025-cover-autoplay',
  'https://www.omegawatches.co.kr/media/wysiwyg/video/diver300m-desktop.mp4',
  "https://youtu.be/mg6Gf7v455c?si=4zaOC6iOz6tAzA3J",
];

const headerMainSx: SxProps<Theme> = {
  width: '100vw',
  height: '120vh',
  minHeight: 700,
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const overlaySx: SxProps<Theme> = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100vw',
  height: '110vh',
  background: 'linear-gradient(0deg,rgba(0,0,0,0.17) 60%,rgba(0,0,0,0.07) 100%)',
  zIndex: 1,
};

const titlesSx: SxProps<Theme> = {
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
};

const HeaderVideo = () => {
  const [src, setSrc] = useState<string>(videoSources[0]);

  useEffect(() => {
    // Choose a random video each time the component mounts (client-side)
    setSrc(videoSources[Math.floor(Math.random() * videoSources.length)]);
  }, []);

  const handleVideoError = () => {
    // Fallback to the other source if current one fails
    const next = videoSources.find((s) => s !== src) ?? videoSources[0];
    if (next !== src) setSrc(next);
  };

  return (
    <Box component="div" className="header-main" sx={headerMainSx}>
      {/* Video BG */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        src={src}
        onError={handleVideoError}
        style={{
          objectFit: 'cover',
          width: '100vw',
          height: '110vh',
          position: 'absolute',
          left: 0,
          top: 0,
          zIndex: 0,
        }}
      />

      {/* Overlay */}
      <Box component="div" sx={overlaySx} />

      {/* Titles */}
      <Box component="div" sx={titlesSx}>
        <div
          style={{
            marginTop: '110px',
            color: '#fff',
            letterSpacing: '0.16em',
            fontWeight: 400,
            fontSize: '2rem',
            fontFamily: 'Judson, serif',
            textShadow: '0 4px 32px rgba(0,0,0,.17)',
            textAlign: 'center',
            textTransform: 'uppercase',
          }}
        >
          THE COLLECTION
        </div>
        <h1
          style={{
            color: '#fff',
            fontWeight: 700,
            fontSize: '6vw',
            lineHeight: '1.1',
            fontFamily: 'Judson, serif',
            margin: '0.1em 0 0 0',
            textShadow: '0 6px 64px rgba(0,0,0,.27)',
            textAlign: 'center',
          }}
        >
          Vorell watches
        </h1>
      </Box>
    </Box>
  );
};

export default HeaderVideo;
