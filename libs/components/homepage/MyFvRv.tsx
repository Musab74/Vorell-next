// libs/components/home/HomePersonalizedSlider.tsx
import React, { useEffect, useMemo } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useReactiveVar, useQuery } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { GET_FAVORITES, GET_VISITED } from "../../../apollo/user/query";

type Props = { alwaysShowFinder?: boolean };

const CARD_MAX_WIDTH = 1360;
const CARD_HEIGHT = { height: "clamp(420px, 40vw, 640px)" };

const RECENTLY_BG_JPEG = "/img/banner/recently.jpeg";
const FAV_BG_WEBP = "/img/banner/favourite.jpeg";
const FAV_BG_PNG = "/img/banner/favourite.jpeg";

const HomePersonalizedSlider: React.FC<Props> = ({ alwaysShowFinder = false }) => {
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const isSignedIn = !!user?._id;

  const { data: favData, refetch: refetchFav } = useQuery(GET_FAVORITES, {
    skip: !isSignedIn,
    fetchPolicy: "network-only",
    variables: { input: { page: 1, limit: 1 } },
  });
  const favoritesCount = useMemo(
    () => favData?.getFavorites?.metaCounter?.[0]?.total ?? 0,
    [favData]
  );

  const { data: visitedData, refetch: refetchVisited } = useQuery(GET_VISITED, {
    skip: !isSignedIn,
    fetchPolicy: "network-only",
    variables: { input: { page: 1, limit: 1 } },
  });
  const recentlyCount = useMemo(
    () => visitedData?.getVisited?.metaCounter?.[0]?.total ?? 0,
    [visitedData]
  );

  const hasFavorites = favoritesCount > 0;
  const hasRecently = recentlyCount > 0;
  const isNewMember = !isSignedIn || (!hasFavorites && !hasRecently);

  useEffect(() => {
    if (!isSignedIn) return;
    refetchFav?.();
    refetchVisited?.();
  }, [isSignedIn, refetchFav, refetchVisited]);

  const swiperKey = `${isSignedIn}-${hasRecently}-${hasFavorites}-${isNewMember}-${alwaysShowFinder}`;

  return (
    <Container maxWidth={false} disableGutters sx={{ py: { xs: 4, md: 6 } }}>
      <Box sx={{ maxWidth: CARD_MAX_WIDTH, mx: "auto", px: { xs: 2, md: 4 } }}>
        <Box sx={{ borderRadius: { xs: 2, md: 3 }, overflow: "hidden" }}>
          <Swiper
            key={swiperKey}
            modules={[Navigation, Pagination, A11y]}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            loop
            style={{ width: "100%" }}
          >
            {hasRecently && (
              <SwiperSlide>
                <Box sx={{ position: "relative", ...CARD_HEIGHT, color: "#fff", bgcolor: "#0b2233" }}>
                  <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
                    <picture>
                      <source media="(min-width: 768px)" sizes="100vw" type="image/jpeg" srcSet={RECENTLY_BG_JPEG} />
                      <source media="(max-width: 767px)" sizes="100vw" type="image/jpeg" srcSet={RECENTLY_BG_JPEG} />
                      <img
                        alt="Recently viewed background"
                        src={RECENTLY_BG_JPEG}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </picture>
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.35) 45%, rgba(0,0,0,.2) 100%)",
                      zIndex: 1,
                    }}
                  />
                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 2,
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      pl: { xs: 3, md: 8 },
                    }}
                  >
                    <Box maxWidth={560}>
                      <Typography variant="overline" sx={{ letterSpacing: ".18em", fontWeight: 600, opacity: 0.9, color: "rgba(255,255,255,.85)" }}>
                        WELCOME BACK
                      </Typography>
                      <Typography
                        component="h2"
                        sx={{
                          fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto",
                          fontWeight: 800,
                          fontSize: { xs: 36, sm: 44, md: 56 },
                          lineHeight: 1.02,
                          mt: 1,
                        }}
                      >
                        Recently
                        <br />
                        viewed watches
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => router.push("/mypage?category=recentlyVisited")}
                        sx={{
                          mt: 3,
                          px: 3.2,
                          py: 1.1,
                          borderRadius: 999,
                          bgcolor: "rgba(255,255,255,.92)",
                          color: "#111",
                          fontWeight: 700,
                          textTransform: "none",
                          "&:hover": { bgcolor: "#fff" },
                        }}
                      >
                        Continue
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </SwiperSlide>
            )}

            {hasFavorites && (
              <SwiperSlide>
                <Box sx={{ position: "relative", ...CARD_HEIGHT, color: "#fff", bgcolor: "#000" }}>
                  <Box sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
                    <picture>
                      <source media="(min-width: 768px)" sizes="100vw" type="image/webp" srcSet={FAV_BG_WEBP} />
                      <source media="(max-width: 767px)" sizes="100vw" type="image/webp" srcSet={FAV_BG_WEBP} />
                      <img
                        alt="Favorites background"
                        src={FAV_BG_PNG}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </picture>
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.35) 45%, rgba(0,0,0,.2) 100%)",
                      zIndex: 1,
                    }}
                  />
                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 2,
                      height: "100%",
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr 1fr" },
                      alignItems: "center",
                      px: { xs: 3, md: 8 },
                      gap: { md: 4 },
                    }}
                  >
                    <Box>
                      <Typography variant="overline" sx={{ letterSpacing: ".18em", fontWeight: 700, color: "rgba(255,255,255,.85)" }}>
                        WELCOME BACK
                      </Typography>
                      <Typography
                        component="h2"
                        sx={{
                          fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto",
                          fontWeight: 800,
                          fontSize: { xs: 32, sm: 42, md: 56 },
                          lineHeight: 1.02,
                          mt: 1,
                        }}
                      >
                        Your favorite
                        <br />
                        watches
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => router.push("/mypage?category=myFavorites")}
                        sx={{
                          mt: 3,
                          px: 3,
                          py: 1,
                          borderRadius: 999,
                          textTransform: "none",
                          bgcolor: "rgba(255,255,255,.92)",
                          color: "#111",
                          fontWeight: 700,
                          "&:hover": { bgcolor: "#fff" },
                        }}
                      >
                        View
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </SwiperSlide>
            )}

            {(isNewMember || alwaysShowFinder) && (
              <SwiperSlide>
                <Box sx={{ position: "relative", ...CARD_HEIGHT, color: "#fff", bgcolor: "#000" }}>
                  <Box sx={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", filter: "saturate(1.05) contrast(1.02)", display: "block" }}
                    >
                      <source
                        src="https://media.rolex.com/video/upload/c_limit,w_1920/f_auto:video/q_auto:best/v1/rolexcom/homepage/homepage-stacker/collection/classic-watches/sky-dweller/homepage-classic-watches-sky-dweller-video-autoplay"
                        type="video/mp4"
                      />
                    </video>
                  </Box>
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(90deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.35) 50%, rgba(0,0,0,.25) 100%)",
                      zIndex: 1,
                    }}
                  />
                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 2,
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      pl: { xs: 3, md: 8 },
                    }}
                  >
                    <Box maxWidth={560}>
                      <Typography variant="overline" sx={{ letterSpacing: ".18em", fontWeight: 700, opacity: 0.9 }}>
                        START HERE
                      </Typography>
                      <Typography
                        component="h2"
                        sx={{
                          fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto",
                          fontWeight: 800,
                          fontSize: { xs: 32, sm: 42, md: 56 },
                          lineHeight: 1.02,
                          mt: 1,
                        }}
                      >
                        Find your favourite watch
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => router.push("/watches")}
                        sx={{
                          mt: 3,
                          px: 3.2,
                          py: 1.1,
                          borderRadius: 999,
                          bgcolor: "rgba(255,255,255,.92)",
                          color: "#111",
                          fontWeight: 700,
                          textTransform: "none",
                          "&:hover": { bgcolor: "#fff" },
                        }}
                      >
                        Explore
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </SwiperSlide>
            )}
          </Swiper>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePersonalizedSlider;
