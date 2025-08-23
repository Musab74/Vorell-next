import React from "react";
import { Box, Button, Typography, Container } from "@mui/material";
import { useRouter } from "next/router";

const AboutStore = () => {
  const router = useRouter();

  return (
    <Box sx={{ width: "100%", bgcolor: "#000" }}>
      {/* HERO */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          minHeight: { xs: "85vh", md: "100vh" },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          overflow: "hidden",
        }}
      >
        {/* Responsive background image */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
          }}
        >
          <picture>
            {/* Desktop / Tablet */}
            <source
              media="(min-width: 768px)"
              sizes="100vw"
              srcSet="
                https://media.rolex.com/image/upload/q_auto:eco/f_auto/c_limit,w_240/v1754407118/rolexcom/homepage/homepage-stacker/rolex-and-sports/motor-sports/classic-cars/2025/homepage-motor-sports-classic-cars-grm16js_0150 240w,
                https://media.rolex.com/image/upload/q_auto:eco/f_auto/c_limit,w_640/v1754407118/rolexcom/homepage/homepage-stacker/rolex-and-sports/motor-sports/classic-cars/2025/homepage-motor-sports-classic-cars-grm16js_0150 640w,
                https://media.rolex.com/image/upload/q_auto:eco/f_auto/c_limit,w_1200/v1754407118/rolexcom/homepage/homepage-stacker/rolex-and-sports/motor-sports/classic-cars/2025/homepage-motor-sports-classic-cars-grm16js_0150 1200w,
                https://media.rolex.com/image/upload/q_auto:eco/f_auto/c_limit,w_1920/v1754407118/rolexcom/homepage/homepage-stacker/rolex-and-sports/motor-sports/classic-cars/2025/homepage-motor-sports-classic-cars-grm16js_0150 1920w,
                https://media.rolex.com/image/upload/q_auto:eco/f_auto/c_limit,w_3840/v1754407118/rolexcom/homepage/homepage-stacker/rolex-and-sports/motor-sports/classic-cars/2025/homepage-motor-sports-classic-cars-grm16js_0150 3840w
              "
            />
            {/* Mobile (Portrait) */}
            <source
              media="(max-width: 767px)"
              sizes="100vw"
              srcSet="
                https://media.rolex.com/image/upload/q_auto:eco/f_auto/c_limit,w_240/v1754407118/rolexcom/homepage/homepage-stacker/rolex-and-sports/motor-sports/classic-cars/2025/homepage-motor-sports-classic-cars-grm16js_0150-portrait 240w,
                https://media.rolex.com/image/upload/q_auto:eco/f_auto/c_limit,w_640/v1754407118/rolexcom/homepage/homepage-stacker/rolex-and-sports/motor-sports/classic-cars/2025/homepage-motor-sports-classic-cars-grm16js_0150-portrait 640w,
                https://media.rolex.com/image/upload/q_auto:eco/f_auto/c_limit,w_1200/v1754407118/rolexcom/homepage/homepage-stacker/rolex-and-sports/motor-sports/classic-cars/2025/homepage-motor-sports-classic-cars-grm16js_0150-portrait 1200w,
                https://media.rolex.com/image/upload/q_auto:eco/f_auto/c_limit,w_1920/v1754407118/rolexcom/homepage/homepage-stacker/rolex-and-sports/motor-sports/classic-cars/2025/homepage-motor-sports-classic-cars-grm16js_0150-portrait 1920w
              "
            />
            {/* fallback */}
            <img
              alt="Vorell Heritage"
              src="https://media.rolex.com/image/upload/q_auto:eco/f_auto/c_limit,w_1920/v1754407118/rolexcom/homepage/homepage-stacker/rolex-and-sports/motor-sports/classic-cars/2025/homepage-motor-sports-classic-cars-grm16js_0150"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </picture>
        </Box>

        {/* Soft gradient overlay */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.6) 100%)",
            zIndex: 1,
          }}
        />

        {/* Content */}
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Box
            sx={{
              textAlign: "center",
              px: { xs: 2, md: 0 },
              mt: { xs: 8, md: 0 },
            }}
          >
            <Typography
              variant="overline"
              sx={{
                letterSpacing: ".2em",
                fontWeight: 600,
                opacity: 0.9,
                textTransform: "uppercase",
              }}
            >
              Vorell and Motor Sport
            </Typography>

            <Typography
              component="h1"
              sx={{
                fontFamily: "Playfair Display, serif",
                fontWeight: 700,
                fontSize: { xs: 40, sm: 54, md: 80 },
                lineHeight: 1.05,
                mt: 1,
              }}
            >
              A sense of heritage
            </Typography>

            <Typography
              sx={{
                maxWidth: 820,
                mx: "auto",
                mt: 2.5,
                mb: 4,
                opacity: 0.9,
                fontSize: { xs: 15.5, md: 18 },
                lineHeight: 1.7,
              }}
            >
              Where precision meets passion. Vorell celebrates the spirit of racing
              and timeless craftsmanship with curated timepieces and fine jewelry.
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={() => router.push("/cs")}
              sx={{
                px: 4,
                py: 1.4,
                fontWeight: 700,
                letterSpacing: ".06em",
                bgcolor: "#ffffff",
                color: "#111",
                borderRadius: 10,
                boxShadow: "none",
                "&:hover": { bgcolor: "#eaeaea", boxShadow: "none" },
              }}
            >
              Learn more
            </Button>
          </Box>
        </Container>

        {/* Decorative right-side guide */}
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            right: { xs: 8, md: 32 },
            top: "50%",
            transform: "translateY(-50%)",
            height: { xs: 90, md: 150 },
            width: 2,
            bgcolor: "rgba(255,255,255,.5)",
            borderRadius: 2,
            zIndex: 2,
          }}
        />
      </Box>
    </Box>
  );
};

export default AboutStore;
