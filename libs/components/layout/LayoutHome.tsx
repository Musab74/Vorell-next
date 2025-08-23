import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import Head from "next/head";
import Top from "../Top";
import Footer from "../Footer";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { getJwtToken, updateUserInfo } from "../../auth";
import Chat from "../Chat";
import HeaderVideo from "../common/FiberContainer";
// ... any other imports

const withLayoutMain = (Component: any) => {
  return (props: any) => {
    const device = useDeviceDetect();
    const user = useReactiveVar(userVar);

    /** LIFECYCLES **/
    useEffect(() => {
      const jwt = getJwtToken();
      if (jwt) updateUserInfo(jwt);
    }, []);

    if (device === "mobile") {
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
    } else {
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

            {/* Header Video Section */}
            <Stack className="header-main">
              <HeaderVideo />
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
    }
  };
};

export default withLayoutMain;
