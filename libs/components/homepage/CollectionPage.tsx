import React from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useQuery } from "@apollo/client";
import { GET_STORES } from "../../../apollo/user/query";
import { Direction } from "../../enums/common.enum";

/** Types */
type StoreCard = {
  _id: string;
  memberNick?: string | null;
  storeWatches?: number | null;
  memberImage?: string | null;
};

/** Constants */
const defaultBg = "/img/logo/defaultBack.jpeg";
const CARD_GAP_PX = 18;
const CARD_HEIGHT_PX = 370;

/** Styled components (avoid giant sx unions) */
const Section = styled(Box)(({ theme }) => ({
  width: "100vw",
  minHeight: "100vh",
  backgroundColor: "#f8fafb",
  padding: "16px",
  [theme.breakpoints.up("md")]: {
    padding: "48px",
  },
}));

const GridCol = styled(Box)({
  maxWidth: 1600,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: `${CARD_GAP_PX}px`,
});

const Row = styled(Box)({
  display: "flex",
  flexDirection: "row",
  gap: `${CARD_GAP_PX}px`,
  height: `${CARD_HEIGHT_PX}px`,
});

const CardBase = styled(Box)({
  flex: 1,
  borderRadius: "10px",
  overflow: "hidden",
  display: "flex",
  alignItems: "flex-end",
  position: "relative",
  height: "100%",
  transition: "box-shadow .18s cubic-bezier(.4,0,.2,1)",
});

const TopCard = styled(CardBase)({
  boxShadow: "0 12px 40px 0 #e0e6f1",
  "&:hover": { boxShadow: "0 18px 60px 0 #c7d0e8" },
});

const BottomCard = styled(CardBase)({
  boxShadow: "0 8px 32px 0 #e0e6f1",
  "&:hover": { boxShadow: "0 18px 60px 0 #c7d0e8" },
});

const OverlayTop = styled(Box)({
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(0deg,rgba(0,0,0,0.23) 65%,rgba(0,0,0,0.01) 100%)",
});

const OverlayBottom = styled(Box)({
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(0deg,rgba(0,0,0,0.19) 67%,rgba(0,0,0,0.01) 100%)",
});

const CardContentTop = styled(Box)({
  position: "relative",
  zIndex: 2,
  color: "#fff",
  paddingLeft: 32,
  paddingRight: 32,
  paddingBottom: 40,
  width: "100%",
});

const CardContentBottom = styled(Box)({
  position: "relative",
  zIndex: 2,
  color: "#fff",
  paddingLeft: 24,
  paddingRight: 24,
  paddingBottom: 32,
  width: "100%",
});

/** Helpers */
const getTopRow = (arr: StoreCard[]) => arr.slice(0, 2);
const getBottomRow = (arr: StoreCard[]) => arr.slice(2, 5);

const titleNode = (
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
);

const CollectionPage: React.FC = () => {
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

  // Use CRA-style env for non-Next setups
  const apiBase = process.env.REACT_APP_API_URL ?? "";

  // Normalize list length to exactly 5
  const stores: StoreCard[] = (data?.getStores?.list as StoreCard[]) ?? [];
  const filled: StoreCard[] = [...stores];
  while (filled.length < 5) {
    filled.push({
      _id: `dummy-${filled.length}`,
      memberNick: "",
      storeWatches: 0,
      memberImage: "",
    });
  }

  const topRow = getTopRow(filled);
  const bottomRow = getBottomRow(filled);

  const goStoreDetail = (id: string) => {
    // Adjust the query key if your detail page expects a different param
    window.open(`/store/detail?storeId=${encodeURIComponent(id)}`, "_self");
  };

  if (loading) {
    return (
      <Section id="stores-section">
        {titleNode}
        <Typography sx={{ textAlign: "center", mt: 10 }}>Loading...</Typography>
      </Section>
    );
  }

  if (error) {
    return (
      <Section id="stores-section">
        {titleNode}
        <Typography sx={{ color: "red", textAlign: "center", mt: 10 }}>
          Error: {error.message}
        </Typography>
      </Section>
    );
  }

  return (
    <Section id="stores-section">
      {titleNode}

      <GridCol>
        {/* Top Row */}
        <Row>
          {topRow.map((store) => {
            const bgImg = store.memberImage
              ? `${apiBase}/${store.memberImage}`
              : defaultBg;
            const isDummy =
              typeof store._id === "string" && store._id.startsWith("dummy");

            return (
              <TopCard
                key={store._id}
                style={{
                  background: `linear-gradient(0deg, rgba(14,17,24,0.09) 0%, rgba(30,30,40,0.07) 80%), url(${bgImg}) center center / cover no-repeat`,
                  cursor: isDummy ? "default" : "pointer",
                }}
                onClick={() => {
                  if (!isDummy) goStoreDetail(store._id);
                }}
              >
                <OverlayTop />
                <CardContentTop>
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
                </CardContentTop>
              </TopCard>
            );
          })}
        </Row>

        {/* Bottom Row */}
        <Row>
          {bottomRow.map((store) => {
            const bgImg = store.memberImage
              ? `${apiBase}/${store.memberImage}`
              : defaultBg;
            const isDummy =
              typeof store._id === "string" && store._id.startsWith("dummy");

            return (
              <BottomCard
                key={store._id}
                style={{
                  background: `linear-gradient(0deg, rgba(14,17,24,0.09) 0%, rgba(30,30,40,0.07) 80%), url(${bgImg}) center center / cover no-repeat`,
                  cursor: isDummy ? "default" : "pointer",
                }}
                onClick={() => {
                  if (!isDummy) goStoreDetail(store._id);
                }}
              >
                <OverlayBottom />
                <CardContentBottom>
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
                </CardContentBottom>
              </BottomCard>
            );
          })}
        </Row>
      </GridCol>
    </Section>
  );
};

export default CollectionPage;
