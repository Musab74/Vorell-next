import React, { useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import MyProperties from '../../libs/components/mypage/MyWatches';
import MyFavorites from '../../libs/components/mypage/MyFavorites';
import RecentlyVisited from '../../libs/components/mypage/RecentlyVisited';
import AddProperty from '../../libs/components/mypage/AddNewProperty';
import MyProfile from '../../libs/components/mypage/MyProfile';
import MyArticles from '../../libs/components/mypage/MyArticles';
import { useMutation, useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import MyMenu from '../../libs/components/mypage/MyMenu';
import WriteArticle from '../../libs/components/mypage/WriteArticle';
import MemberFollowers from '../../libs/components/member/MemberFollowers';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import MemberFollowings from '../../libs/components/member/MemberFollowings';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { LIKE_TARGET_MEMBER, SUBSCRIBE, UNSUBSCRIBE } from '../../apollo/user/mutation';
import { Messages } from '../../libs/config';
import { getJwtToken } from '../../libs/auth'; // ← make sure path is correct in your project

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

const MyPage: NextPage = () => {
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const router = useRouter();
  const token = useMemo(() => getJwtToken?.(), []); // keep it stable for the effect

  // normalize category and support both “watch” and legacy names
  const rawCategory = (router.query?.category as string) ?? 'myProfile';
  const normalized = rawCategory?.toLowerCase();
  const categoryMap: Record<string, string> = {
    addwatch: 'addProperty',
    mywatches: 'myProperties',
    addproperty: 'addProperty',
    myproperties: 'myProperties',
    myfavorites: 'myFavorites',
    recentlyvisited: 'recentlyVisited',
    myarticles: 'myArticles',
    writearticle: 'writeArticle',
    myprofile: 'myProfile',
    followers: 'followers',
    followings: 'followings',
  };
  const category = categoryMap[normalized] ?? 'myProfile';

  /** AUTH: only redirect if there's truly no auth token.
   * This avoids kicking out a valid STORE before userVar hydrates.
   */
  useEffect(() => {
    if (!router.isReady) return;
    // If you *require* login, check token first. If there's no token, go home.
    if (!token) {
      router.replace('/'); // not push, to avoid history stacking
      return;
    }
    // If logged in and no category given, default by role
    if (!router.query.category) {
      const defaultCat = user?.memberType === 'STORE' ? 'myWatches' : 'myProfile';
      router.replace({ pathname: '/mypage', query: { category: defaultCat } }, undefined, { shallow: true });
    }
    console.log(`MyPage mounted with category: ${category} and user: ${user?._id}`);
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, token, user?.memberType]);

  /** APOLLO REQUESTS **/
  const [subscribe] = useMutation(SUBSCRIBE);
  const [unsubscribe] = useMutation(UNSUBSCRIBE);
  const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

  /** HANDLERS **/
  const subscribeHandler = async (id: string, refetch: any, query: any) => {
    try {
      if (!id) throw new Error(Messages.error1);
      if (!user?._id) throw new Error(Messages.error2);
      await subscribe({ variables: { input: id } });
      await sweetTopSmallSuccessAlert('Subscribed successfully', 800);
      await refetch({ input: query });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const unsubscribeHandler = async (id: string, refetch: any, query: any) => {
    try {
      if (!id) throw new Error(Messages.error1);
      if (!user?._id) throw new Error(Messages.error2);
      await unsubscribe({ variables: { input: id } });
      await sweetTopSmallSuccessAlert('Unsubscribed successfully', 800);
      await refetch({ input: query });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const likeMemberHandler = async (id: string, refetch: any, query: any) => {
    try {
      if (!id) return;
      if (!user?._id) throw new Error(Messages.error2);
      await likeTargetMember({ variables: { input: id } });
      await sweetTopSmallSuccessAlert('Liked successfully', 800);
      await refetch({ input: query });
    } catch (err: any) {
      sweetErrorHandling(err).then();
    }
  };

  const redirectToMemberPageHandler = async (memberId: string) => {
    try {
      if (memberId === user?._id) {
        await router.push(`/mypage?memberId=${memberId}`);
      } else {
        await router.push(`/member?memberId=${memberId}`);
      }
    } catch (error) {
      await sweetErrorHandling(error);
    }
  };

  if (device === 'mobile') return <div>MY PAGE</div>;

  return (
    <div id="my-page" style={{ position: 'relative' }}>
      <div className="container">
        <Stack className="my-page">
          <Stack className="back-frame">
            <Stack className="left-config">
              <MyMenu />
            </Stack>
            <Stack className="main-config" mb="76px">
              <Stack className="list-config">
                {category === 'addProperty' && <AddProperty />}
                {category === 'myProperties' && <MyProperties />}
                {category === 'myFavorites' && <MyFavorites />}
                {category === 'recentlyVisited' && <RecentlyVisited />}
                {category === 'myArticles' && <MyArticles />}
                {category === 'writeArticle' && <WriteArticle />}
                {category === 'myProfile' && <MyProfile />}

                {category === 'followers' && (
                  <MemberFollowers
                    subscribeHandler={subscribeHandler}
                    unsubscribeHandler={unsubscribeHandler}
                    likeMemberHandler={likeMemberHandler}
                    redirectToMemberPageHandler={redirectToMemberPageHandler}
                  />
                )}

                {category === 'followings' && (
                  <MemberFollowings
                    subscribeHandler={subscribeHandler}
                    unsubscribeHandler={unsubscribeHandler}
                    likeMemberHandler={likeMemberHandler}
                    redirectToMemberPageHandler={redirectToMemberPageHandler}
                  />
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export default withLayoutBasic(MyPage);
