import React, { ChangeEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import ReviewCard from '../../libs/components/store/ReviewCard';
import { Box, Button, Pagination, Stack, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Member } from '../../libs/types/member/member';
import { Watch } from '../../libs/types/watch/watch';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { userVar } from '../../apollo/store';
import { WatchesInquiry } from '../../libs/types/watch/watch.input';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { REACT_APP_API_URL } from '../../libs/config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GET_MEMBER, GET_STORE_WATCHES, GET_COMMENTS } from '../../apollo/user/query';
import { CREATE_COMMENT, LIKE_TARGET_WATCH } from '../../apollo/user/mutation';
import { Message } from '../../libs/enums/common.enum';
import PropertyBigCard from '../../libs/components/common/PropertyBigCard';
import Link from 'next/link';

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

const StoreDetail: NextPage = ({ initialInput, initialComment }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);

  const [memberId, setMemberId] = useState<string | null>(null);
  const [store, setStore] = useState<Member | null>(null);

  const [searchFilter, setSearchFilter] = useState<WatchesInquiry>(initialInput);
  const [storeWatches, setStoreWatches] = useState<Watch[]>([]);
  const [watchTotal, setWatchTotal] = useState<number>(0);

  const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
  const [storeComments, setStoreComments] = useState<Comment[]>([]);
  const [commentTotal, setCommentTotal] = useState<number>(0);

  const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
    commentGroup: CommentGroup.STORE,
    commentContent: '',
    commentRefId: '',
  });

  /** QUERIES & MUTATIONS **/
  const { refetch: getStoreRefetch } = useQuery(GET_MEMBER, {
    fetchPolicy: 'network-only',
    variables: { input: memberId },
    skip: !memberId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: any) => {
      setStore(data?.getMember);
      setSearchFilter((prev) => ({
        ...prev,
        search: { ...prev.search, memberId: data?.getMember?._id },
      }));
      setCommentInquiry((prev) => ({
        ...prev,
        search: { ...prev.search, commentRefId: data?.getMember?._id },
      }));
    },
  });

  const { refetch: getWatchesRefetch } = useQuery(GET_STORE_WATCHES, {
    fetchPolicy: 'network-only',
    variables: { input: searchFilter },
    skip: !searchFilter.search?.memberId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: any) => {
      setStoreWatches(data?.getStoreWatches?.list);
      setWatchTotal(data?.getStoreWatches?.metaCounter[0]?.total || 0);
    },
  });

  const { refetch: getCommentsRefetch } = useQuery(GET_COMMENTS, {
    fetchPolicy: 'cache-and-network',
    variables: { input: commentInquiry },
    skip: !commentInquiry.search?.commentRefId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: any) => {
      setStoreComments(data?.getComments?.list);
      setCommentTotal(data?.getComments?.metaCounter[0]?.total || 0);
    },
  });

  const [likeTargetWatch] = useMutation(LIKE_TARGET_WATCH);
  const [createComment] = useMutation(CREATE_COMMENT);

  /** EFFECTS **/
  useEffect(() => {
    if (router.query.storeId) setMemberId(router.query.storeId as string);
  }, [router.isReady, router.query.storeId]);

  useEffect(() => {
    if (store?._id) {
      setInsertCommentData((prev) => ({
        ...prev,
        commentGroup: CommentGroup.STORE,
        commentRefId: store._id,
      }));
    }
  }, [store?._id]);

  useEffect(() => {
    if (searchFilter.search?.memberId) {
      getWatchesRefetch({ variables: { input: searchFilter } });
    }
  }, [searchFilter, getWatchesRefetch]);

  useEffect(() => {
    if (commentInquiry.search?.commentRefId) {
      getCommentsRefetch({ variables: { input: commentInquiry } });
    }
  }, [commentInquiry, getCommentsRefetch]);

  /** HANDLERS **/
  const redirectToStorePageHandler = async (mId: string) => {
    try {
      if (mId === user?._id) await router.push(`/mypage?memberId=${mId}`);
      else await router.push(`/store?memberId=${mId}`);
    } catch (error) {
      await sweetErrorHandling(error);
    }
  };

  const watchPaginationChangeHandler = async (_: ChangeEvent<unknown>, value: number) => {
    setSearchFilter({ ...searchFilter, page: value });
  };

  const commentPaginationChangeHandler = async (_: ChangeEvent<unknown>, value: number) => {
    setCommentInquiry({ ...commentInquiry, page: value });
  };

  
  const likeWatchHandler = async (me: any, id: string) => {
    try {
      if (!id) return;
      if (!me?._id) throw new Error(Message.NOT_AUTHENTICATED);

     
	  await likeTargetWatch({ variables: { watchId: id } });


	  await getWatchesRefetch({ input: searchFilter });
      await sweetTopSmallSuccessAlert('Success', 700);
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    }
  };

  const createCommentHandler = async () => {
    try {
      if (!user?._id) throw new Error(Message.NOT_AUTHENTICATED);
      if (user._id === memberId) throw new Error('Cannot write a review to yourself');

      await createComment({ variables: { input: insertCommentData } });

      setInsertCommentData((prev) => ({ ...prev, commentContent: '' }));

      // Fix: include variables wrapper on refetch
      await getCommentsRefetch({ variables: { input: commentInquiry } });
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    }
  };

  /** RENDER **/
  if (device === 'mobile') {
    return <div>STORE DETAIL PAGE MOBILE</div>;
  }

  return (
    <Stack className="store-detail-page-luxury">
      <Stack className="lux-container">
        <Stack className="store-info-lux">
          <img
            src={store?.memberImage ? `${REACT_APP_API_URL}/${store?.memberImage}` : '/img/profile/defaultUser.svg'}
            alt=""
            className="store-avatar"
          />
          <Box className="info-lux" onClick={() => redirectToStorePageHandler(store?._id as string)}>
            <strong>{store?.memberFullName ?? store?.memberNick}</strong>
            <Link
              href={{ pathname: '/member', query: { memberId: store?._id } }}
              onClick={(e) => e.stopPropagation()}
              style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit' }}
            >
              <img src="/img/icons/call.svg" alt="call" />
              <span>{store?.memberPhone}</span>
            </Link>
          </Box>
        </Stack>

        <Stack className="store-watches-list-lux">
          <Stack className="card-wrap-lux">
            {storeWatches.map((watch: Watch) => (
              <div className="wrap-main-lux" key={watch?._id}>
                <PropertyBigCard watch={watch} user={user} likeWatchHandler={likeWatchHandler} />
              </div>
            ))}
          </Stack>

          <Stack className="pagination-lux">
            {watchTotal ? (
              <>
                <Stack className="pagination-box-lux">
                  <Pagination
                    page={searchFilter.page}
                    count={Math.ceil(watchTotal / searchFilter.limit) || 1}
                    onChange={watchPaginationChangeHandler}
                    shape="circular"
                    color="primary"
                  />
                </Stack>
                <span>
                  Total {watchTotal} watche{watchTotal > 1 ? 's' : ''} available
                </span>
              </>
            ) : (
              <div className="no-data-lux">
                <img src="/img/icons/icoAlert.svg" alt="" />
                <p>No watches found!</p>
              </div>
            )}
          </Stack>
        </Stack>

        <Stack className="review-box-lux">
          <Stack className="main-intro-lux">
            <span>Reviews</span>
            <p>We are glad to see you again</p>
          </Stack>

          {commentTotal !== 0 && (
            <Stack className="review-wrap-lux">
              <Box className="title-box-lux">
                <StarIcon />
                <span>
                  {commentTotal} review{commentTotal > 1 ? 's' : ''}
                </span>
              </Box>

              {storeComments?.map((comment: Comment) => (
                <ReviewCard comment={comment} key={comment?._id} />
              ))}

              <Box className="pagination-box-lux">
                <Pagination
                  page={commentInquiry.page}
                  count={Math.ceil(commentTotal / commentInquiry.limit) || 1}
                  onChange={commentPaginationChangeHandler}
                  shape="circular"
                  color="primary"
                />
              </Box>
            </Stack>
          )}

          <Stack className="leave-review-config-lux">
            <Typography className="main-title-lux">Leave A Review</Typography>
            <Typography className="review-title-lux">Review</Typography>

            <textarea
              onChange={({ target: { value } }: any) => {
                setInsertCommentData((prev) => ({
                  ...prev,
                  commentContent: value,
                }));
              }}
              value={insertCommentData.commentContent}
            />

            <Box className="submit-btn-lux" component="div">
              <Button
                className="submit-review-lux"
                disabled={insertCommentData.commentContent === '' || !user?._id}
                onClick={createCommentHandler}
              >
                <Typography className="title-lux">Submit Review</Typography>
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                  <g clipPath="url(#clip0_6975_3642)">
                    <path
                      d="M16.1571 0.5H6.37936C6.1337 0.5 5.93491 0.698792 5.93491 0.944458C5.93491 1.19012 6.1337 1.38892 6.37936 1.38892H15.0842L0.731781 15.7413C0.558156 15.915 0.558156 16.1962 0.731781 16.3698C0.818573 16.4566 0.932323 16.5 1.04603 16.5C1.15974 16.5 1.27345 16.4566 1.36028 16.3698L15.7127 2.01737V10.7222C15.7127 10.9679 15.9115 11.1667 16.1572 11.1667C16.4028 11.1667 16.6016 10.9679 16.6016 10.7222V0.944458C16.6016 0.698792 16.4028 0.5 16.1571 0.5Z"
                      fill="#181A20"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_6975_3642">
                      <rect width="16" height="16" fill="white" transform="translate(0.601562 0.5)" />
                    </clipPath>
                  </defs>
                </svg>
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

StoreDetail.defaultProps = {
  initialInput: {
    page: 1,
    limit: 9,
    search: { memberId: '' },
  },
  initialComment: {
    page: 1,
    limit: 5,
    sort: 'createdAt',
    direction: 'ASC',
    search: { commentRefId: '' },
  },
};

export default withLayoutBasic(StoreDetail);
