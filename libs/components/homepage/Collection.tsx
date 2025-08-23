import React from 'react';
import { Stack, Box, Button } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const CollectionSection = () => {
  return (
    <Stack
      direction="row"
      alignItems="flex-start"
      justifyContent="center"
      spacing={8}
      sx={{
        width: '100vw',
        minHeight: 320,
        background: '#fff',
        paddingTop: '70px',
        boxSizing: 'border-box',
      }}
    >
      {/* Left Side: Heading */}
      <Box
        sx={{
          flex: '0 0 52vw',
          paddingLeft: '150px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: "'Montserrat','Arial',sans-serif",
            fontWeight: 800,
            fontSize: '3.6rem',
					  color: '#217150',
					  margin: 0,
					  letterSpacing: '0.01em',
					  lineHeight: 1.08,
					  whiteSpace: 'nowrap',
				  }}
			  >
				  Explore the Vorell collection        </h1>
		  </Box>

		  {/* Right Side: Description + Button */}
		  <Box
			  sx={{
				  flex: '1 1 48vw',
				  paddingRight: '150px',
				  display: 'flex',
				  flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          minHeight: 250,
        }}
      >
        <p
          style={{
            fontFamily: "'Montserrat','Arial',sans-serif",
            fontSize: '1.27rem',
            color: '#222',
            lineHeight: 1.48,
            margin: '0 0 60px 0',
            maxWidth: 600,
            letterSpacing: '0.01em',
          }}
        >
          Experience the artistry of time with Vorell. Our curated selection features exquisite Swiss-made timepieces, blending modern luxury and timeless craftsmanship for discerning collectors.
        </p>
        <Button
          endIcon={<ArrowForwardIosIcon style={{ fontSize: 18 }} />}
          disableElevation
		  href="/watches"
          sx={{
            mt: 2,
            px: 0,
            py: 0,
            fontFamily: "'Montserrat','Arial',sans-serif",
            fontWeight: 700,
            fontSize: '1.09rem',
            color: '#217150',
            background: 'transparent',
            boxShadow: 'none',
            textTransform: 'none',
            minWidth: 0,
            minHeight: 0,
            height: 32,
            '&:hover': {
              background: 'rgba(33, 113, 80, 0.06)',
              color: '#14523d',
              boxShadow: 'none',
            },
            '& .MuiButton-endIcon': {
              marginLeft: '4px',
            },
          }}
        >
          Explore Vorell Watches
        </Button>
      </Box>
    </Stack>
  );
};

export default CollectionSection;
