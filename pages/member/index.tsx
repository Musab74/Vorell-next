import React, { useEffect } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack } from '@mui/material';
import MemberMenu from '../../libs/components/member/MemberMenu';
import { useRouter } from 'next/router';
import MemberFollowers from '../../libs/components/member/MemberFollowers';
import MemberArticles from '../../libs/components/member/MemberArticles';
import { useMutation, useReactiveVar } from '@apollo/client';
import { sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import MemberFollowings from '../../libs/components/member/MemberFollowings';
import { userVar } from '../../apollo/store';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { LIKE_TARGET_MEMBER, SUBSCRIBE, UNSUBSCRIBE } from '../../apollo/user/mutation';
import { Messages } from '../../libs/config';

// Reuse your existing list component but name it for watches in this page.
// (If you later create a dedicated MemberWatches component, just change this import.)
import MemberWatches from '../../libs/components/member/MemberProperties';

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

const MemberPage: NextPage = () => {
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);

  // category defaults to "watches" for the watch website
  const category: any = router.query?.category ?? 'watches';
  const viewedMemberId = (router.query?.memberId as string) || '';

  /** APOLLO REQUESTS **/
  const [subscribe] = useMutation(SUBSCRIBE);
  const [unsubscribe] = useMutation(UNSUBSCRIBE);
  const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

  /** LIFECYCLES **/
  useEffect(() => {
    if (!router.isReady) return;
    if (!router.query?.category) {
      router.replace(
        { pathname: router.pathname, query: { ...router.query, category: 'watches' } },
        undefined,
        { shallow: true },
      );
    }
  }, [router.isReady, router.query, router, category]);

  /** HANDLERS **/
  const subscribeHandler = async (id: string, refetch: any, query: any) => {
    try {
      if (!id) throw new Error(Messages.error1);
      if (!user?._id) throw new Error(Messages.error2);

      // prevent self subscription (stops "Self subscription is denied!" server error)
      if (user._id === id) {
        await sweetTopSmallSuccessAlert("You can't follow yourself", 900);
        return;
      }

      await subscribe({ variables: { input: id } });
      await sweetTopSmallSuccessAlert('Followed', 800);
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
      await sweetTopSmallSuccessAlert('Unfollowed', 800);
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
      console.error('Error liking target member:', err);
      sweetErrorHandling(err).then();
    }
  };

  const redirectToMemberPageHandler = async (memberId: string) => {
    try {
      if (memberId === user?._id) await router.push(`/mypage?memberId=${memberId}`);
      else await router.push(`/member?memberId=${memberId}`);
    } catch (error) {
      await sweetErrorHandling(error);
    }
  };

  if (device === 'mobile') {
    return <>MEMBER PAGE MOBILE</>;
  }

  return (
    <div id="member-page" style={{ position: 'relative' }}>
      <div className="container">
        <Stack className="member-page">
          <Stack className="back-frame">
            <Stack className="left-config">
              {/* MemberMenu can keep using the same handlers */}
              <MemberMenu
                subscribeHandler={subscribeHandler}
                unsubscribeHandler={unsubscribeHandler}
              />
            </Stack>

            <Stack className="main-config" mb="76px">
              <Stack className="list-config">
                {category === 'watches' && <MemberWatches />}
                {category === 'followers' && (
                  <MemberFollowers
                    subscribeHandler={subscribeHandler}
                    unsubscribeHandler={unsubscribeHandler}
                    redirectToMemberPageHandler={redirectToMemberPageHandler}
                    likeMemberHandler={likeMemberHandler}
                  />
                )}
                {category === 'followings' && (
                  <MemberFollowings
                    subscribeHandler={subscribeHandler}
                    unsubscribeHandler={unsubscribeHandler}
                    redirectToMemberPageHandler={redirectToMemberPageHandler}
                    likeMemberHandler={likeMemberHandler}
                  />
                )}
                {category === 'articles' && <MemberArticles />}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </div>
    </div>
  );
};

export default withLayoutBasic(MemberPage);
