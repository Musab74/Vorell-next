// libs/components/homepage/Collection.tsx
import React from 'react';
import { Stack, Button } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const sectionStyle: React.CSSProperties = {
  width: '100vw',
  minHeight: 320,
  background: '#fff',
  paddingTop: '70px',
  boxSizing: 'border-box',
};

const rowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  gap: '64px', // spacing={8}
  width: '100%',
};

const leftColStyle: React.CSSProperties = {
  flex: '0 0 52vw',
  paddingLeft: '150px',
  display: 'flex',
  alignItems: 'center',
};

const rightColStyle: React.CSSProperties = {
  flex: '1 1 48vw',
  paddingRight: '150px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  minHeight: 250,
};

const h1Style: React.CSSProperties = {
  fontFamily: "'Montserrat','Arial',sans-serif",
  fontWeight: 800,
  fontSize: '3.6rem',
  color: '#217150',
  margin: 0,
  letterSpacing: '0.01em',
  lineHeight: 1.08,
  whiteSpace: 'nowrap',
};

const pStyle: React.CSSProperties = {
  fontFamily: "'Montserrat','Arial',sans-serif",
  fontSize: '1.27rem',
  color: '#222',
  lineHeight: 1.48,
  margin: '0 0 60px 0',
  maxWidth: 600,
  letterSpacing: '0.01em',
};

const buttonSx = {
  mt: 2,
  px: 0,
  py: 0,
  fontFamily: "'Montserrat','Arial',sans-serif",
  fontWeight: 700,
  fontSize: '1.09rem',
  color: '#217150',
  background: 'transparent',
  boxShadow: 'none',
  textTransform: 'none' as const,
  minWidth: 0,
  minHeight: 0,
  height: 32,
  '&:hover': {
    background: 'rgba(33, 113, 80, 0.06)',
    color: '#14523d',
    boxShadow: 'none',
  },
  '& .MuiButton-endIcon': { marginLeft: '4px' },
};

const Collection: React.FC = () => {
  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="center"
      style={sectionStyle}
    >
      <div style={rowStyle}>
        {/* Left Side: Heading */}
        <div style={leftColStyle}>
          <h1 style={h1Style}>Explore the Vorell collection</h1>
        </div>

        {/* Right Side: Description + Button */}
        <div style={rightColStyle}>
          <p style={pStyle}>
            Experience the artistry of time with Vorell. Our curated selection features exquisite Swiss-made
            timepieces, blending modern luxury and timeless craftsmanship for discerning collectors.
          </p>

          <Button
            endIcon={<ArrowForwardIosIcon style={{ fontSize: 18 }} />}
            disableElevation
            href="/watches"
            sx={buttonSx}
          >
            Explore Vorell Watches
          </Button>
        </div>
      </div>
    </Stack>
  );
};

export default Collection;
