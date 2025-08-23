import React from "react";
import { Box, Typography } from "@mui/material";
import { useQuery } from "@apollo/client";
import { GET_STORES } from "../../../apollo/user/query"; // <-- UPDATE path as needed
import Link from "next/link";
import { Direction } from "../../enums/common.enum";

// Helper: fallback background
const defaultBg = "/img/logo/defaultBack.jpeg";

const getTopRow = (arr: any[]) => arr.slice(0, 2);
const getBottomRow = (arr: any[]) => arr.slice(2, 5);

const CARD_GAP = 18; // px
const CARD_HEIGHT = 370; // px

const StorePage = () => {
  const { data, loading, error } = useQuery(GET_STORES, {
    variables: {
      input: {
        page: 1,
        limit: 5,
        sort: "storeWatches",
        direction: Direction.DESC,
        search: {},
      },
    },
    fetchPolicy: "cache-and-network",
  });

  // Defensive: prevent error on first load
  const stores = data?.getStores?.list ?? [];

  // Always fill 5 stores
  const filledStores = [...stores];
  while (filledStores.length < 5) {
    filledStores.push({
      _id: `dummy-${filledStores.length}`,
      memberNick: "",
      storeWatches: 0,
      memberImage: "",
    });
  }

  const topRow = getTopRow(filledStores);
  const bottomRow = getBottomRow(filledStores);

  return (
    <Box
      id="stores-section"
      sx={{
        width: "100vw",
        minHeight: "100vh",
        bgcolor: "#f8fafb",
        p: { xs: 2, md: 6 },
      }}
    >
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          fontFamily: "Playfair Display, serif",
          fontWeight: 600,
          mb: 4,
          color: "#132044",
          fontSize: { xs: 30, md: 44 },
        }}
      >
        Top Stores
      </Typography>
      {loading ? (
        <Typography sx={{ textAlign: "center", mt: 10 }}>Loading...</Typography>
      ) : error ? (
        <Typography sx={{ color: "red", textAlign: "center", mt: 10 }}>
          Error: {error.message}
        </Typography>
      ) : (
        <Box
          sx={{
            maxWidth: 1600,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            gap: `${CARD_GAP}px`,
          }}
        >
          {/* Top Row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: `${CARD_GAP}px`,
              height: `${CARD_HEIGHT}px`,
            }}
          >
            {topRow.map((store: any) => {
              const bgImg =
                store.memberImage
                  ? `${process.env.REACT_APP_API_URL}/${store.memberImage}`
                  : defaultBg;

              // Only clickable if real store
              const isDummy = store._id.startsWith("dummy");
              return (
                <Box
                  key={store._id}
                  sx={{
                    flex: 1,
                    borderRadius: "10px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "flex-end",
                    background: `linear-gradient(0deg, rgba(14,17,24,0.09) 0%, rgba(30,30,40,0.07) 80%), url(${bgImg}) center center / cover no-repeat`,
                    boxShadow: "0 12px 40px 0 #e0e6f1",
                    position: "relative",
                    height: "100%",
                    cursor: isDummy ? "default" : "pointer",
                    transition: "box-shadow .18s cubic-bezier(.4,0,.2,1)",
                    "&:hover": {
                      boxShadow: isDummy
                        ? "0 12px 40px 0 #e0e6f1"
                        : "0 18px 60px 0 #c7d0e8",
                    },
                  }}
                  onClick={() =>
                    !isDummy && window.open(`/store/${store._id}`, "_self")
                  }
                >
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(0deg,rgba(0,0,0,0.23) 65%,rgba(0,0,0,0.01) 100%)",
                    }}
                  />
                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 2,
                      color: "#fff",
                      px: 4,
                      pb: 5,
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontSize: { xs: 22, md: 36 },
                        fontFamily: "Playfair Display, serif",
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      {store.memberNick || ""}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: { xs: 17, md: 26 },
                        fontFamily: "Lato, Arial, sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      {store.storeWatches ?? 0} Watches
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
          {/* Bottom Row */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: `${CARD_GAP}px`,
              height: `${CARD_HEIGHT}px`,
            }}
          >
            {bottomRow.map((store: any) => {
              const bgImg =
                store.memberImage
                  ? `${process.env.REACT_APP_API_URL}/${store.memberImage}`
                  : defaultBg;
              const isDummy = store._id.startsWith("dummy");
              return (
                <Box
                  key={store._id}
                  sx={{
                    flex: 1,
                    borderRadius: "10px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "flex-end",
                    background: `linear-gradient(0deg, rgba(14,17,24,0.09) 0%, rgba(30,30,40,0.07) 80%), url(${bgImg}) center center / cover no-repeat`,
                    boxShadow: "0 8px 32px 0 #e0e6f1",
                    position: "relative",
                    height: "100%",
                    cursor: isDummy ? "default" : "pointer",
                    transition: "box-shadow .18s cubic-bezier(.4,0,.2,1)",
                    "&:hover": {
                      boxShadow: isDummy
                        ? "0 8px 32px 0 #e0e6f1"
                        : "0 18px 60px 0 #c7d0e8",
                    },
                  }}
                  onClick={() =>
                    !isDummy && window.open(`/store/${store._id}`, "_self")
                  }
                >
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(0deg,rgba(0,0,0,0.19) 67%,rgba(0,0,0,0.01) 100%)",
                    }}
                  />
                  <Box
                    sx={{
                      position: "relative",
                      zIndex: 2,
                      color: "#fff",
                      px: 3,
                      pb: 4,
                      width: "100%",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: { xs: 19, md: 24 },
                        fontFamily: "Playfair Display, serif",
                        fontWeight: 600,
                        mb: 0.5,
                      }}
                    >
                      {store.memberNick || ""}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: 14, md: 19 },
                        fontFamily: "Lato, Arial, sans-serif",
                        fontWeight: 400,
                      }}
                    >
                      {store.storeWatches ?? 0} Watches
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default StorePage;
