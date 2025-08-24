import React, { ChangeEvent, useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutFull from '../../libs/components/layout/LayoutFull';
import { NextPage } from 'next';
import Review from '../../libs/components/property/Review';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import PropertyBigCard from '../../libs/components/common/PropertyBigCard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Watch } from '../../libs/types/watch/watch';
import { GET_COMMENTS, GET_WATCHES, GET_WATCH } from '../../apollo/user/query';
import { CREATE_COMMENT, LIKE_TARGET_WATCH } from '../../apollo/user/mutation';
import { Direction, Message } from '../../libs/enums/common.enum';
import moment from 'moment';
import { formatterStr } from '../../libs/utils';
import { REACT_APP_API_URL } from '../../libs/config';
import { userVar } from '../../apollo/store';
import { CommentInput, CommentsInquiry } from '../../libs/types/comment/comment.input';
import { Comment } from '../../libs/types/comment/comment';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { Pagination as MuiPagination } from '@mui/material';
import Link from 'next/link';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import 'swiper/css';
import 'swiper/css/pagination';
import { T } from '../../libs/types/common';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';

SwiperCore.use([Autoplay, Navigation, Pagination]);

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

const WatchDetail: NextPage = ({ initialComment, ...props }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const [watchId, setWatchId] = useState<string | null>(null);
  const [watch, setWatch] = useState<Watch | null>(null);
  const [slideImage, setSlideImage] = useState<string>('');
  const [destinationWatches, setDestinationWatches] = useState<Watch[]>([]);
  const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>(initialComment);
  const [watchComments, setWatchComments] = useState<Comment[]>([]);
  const [commentTotal, setCommentTotal] = useState<number>(0);
  const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
    commentGroup: CommentGroup.WATCH,
    commentContent: '',
    commentRefId: '',
  });

  const [likeTargetWatch] = useMutation(LIKE_TARGET_WATCH);
  const [createComment] = useMutation(CREATE_COMMENT);

  const {
    loading: getWatchLoading,
    refetch: getWatchRefetch,
  } = useQuery(GET_WATCH, {
    fetchPolicy: 'network-only',
    variables: { input: watchId },
    skip: !watchId,
    notifyOnNetworkStatusChange: true,
    onCompleted(data: T) {
      if (data?.getWatch) setWatch(data?.getWatch);
      if (data?.getWatch) setSlideImage(data?.getWatch?.images[0]);
    },
  });

  const { refetch: getWatchesRefetch } = useQuery(GET_WATCHES, {
    fetchPolicy: 'cache-and-network',
    variables: {
      input: {
        page: 1,
        limit: 4,
        sort: 'createdAt',
        direction: Direction.DESC,
        search: {
          originList: watch?.watchOrigin ? [watch?.watchOrigin] : [],
        },
      },
    },
    skip: !watchId && !watch,
    notifyOnNetworkStatusChange: true,
    onCompleted(data: T) {
      if (data?.getWatches?.list) setDestinationWatches(data.getWatches.list);
    },
  });

  const { refetch: getCommentsRefetch } = useQuery(GET_COMMENTS, {
    fetchPolicy: 'cache-and-network',
    variables: { input: initialComment },
    skip: !commentInquiry.search.commentRefId,
    notifyOnNetworkStatusChange: true,
    onCompleted(data: T) {
      if (data?.getComments?.list) setWatchComments(data.getComments.list);
      setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
    },
  });

  useEffect(() => {
    if (router.query.id) {
      setWatchId(router.query.id as string);
      setCommentInquiry({
        ...commentInquiry,
        search: { commentRefId: router.query.id as string },
      });
      setInsertCommentData({
        ...insertCommentData,
        commentRefId: router.query.id as string,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id]);

  useEffect(() => {
    if (commentInquiry.search.commentRefId) {
      getCommentsRefetch({ input: commentInquiry });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commentInquiry]);

  const changeImageHandler = (image: string) => {
    setSlideImage(image);
  };

  const likeWatchHandler = async (userData: T, id: string) => {
    try {
      if (!id) return;
      if (!userData._id) throw new Error(Message.NOT_AUTHENTICATED);
      await likeTargetWatch({ variables: { watchId: id } });
      await getWatchRefetch({ input: id });
      await getWatchesRefetch({
        input: {
          page: 1,
          limit: 4,
          sort: 'createdAt',
          direction: Direction.DESC,
          search: { originList: watch?.watchOrigin ? [watch.watchOrigin] : [] },
        },
      });
      await sweetTopSmallSuccessAlert('Success', 800);
    } catch (err: any) {
      sweetMixinErrorAlert(err.message).then();
    }
  };

  const commentPaginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
    commentInquiry.page = value;
    setCommentInquiry({ ...commentInquiry });
  };

  const createCommentHandler = async () => {
    try {
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
      await createComment({ variables: { input: insertCommentData } });
      setInsertCommentData({ ...insertCommentData, commentContent: '' });
      getCommentsRefetch();
    } catch (err: any) {
      await sweetErrorHandling(err);
    }
  };

  if (getWatchLoading) {
    return (
      <Stack sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '1080px' }}>
        <CircularProgress size="4rem" />
      </Stack>
    );
  }

  if (device === 'mobile') {
    return <div>WATCH DETAIL PAGE</div>;
  }

  return (
    <div id="property-detail-page">
      <div className="container">
        <Stack className="property-detail-config">
          <Stack className="property-info-config">
            <Stack className="info">
              <Stack className="left-box">
                <Typography className="title-main">{watch?.modelName}</Typography>
                <Stack className="top-box">
                  <Typography className="city">{watch?.watchOrigin}</Typography>
                  <Stack className="divider"></Stack>
                  <Stack className="buy-rent-box">
                    {watch?.isLimitedEdition && (
                      <>
                        <Stack className="circle">
                          <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                            <circle cx="3" cy="3" r="3" fill="#EB6753" />
                          </svg>
                        </Stack>
                        <Typography className="buy-rent">Limited</Typography>
                      </>
                    )}
                    {watch?.isLimitedEdition && (
                      <>
                        <Stack className="circle">
                          <svg xmlns="http://www.w3.org/2000/svg" width="6" height="6" viewBox="0 0 6 6" fill="none">
                            <circle cx="3" cy="3" r="3" fill="#EB6753" />
                          </svg>
                        </Stack>
                        <Typography className="buy-rent">Special</Typography>
                      </>
                    )}
                  </Stack>
                  <Stack className="divider"></Stack>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none"></svg>
                  <Typography className="date">{moment().diff(watch?.createdAt, 'days')} days ago</Typography>
                </Stack>

                <Stack className="bottom-box">
                  <Stack className="option">
                    <img src="/img/icons/movement.png" alt="" /> <Typography>{watch?.movement}</Typography>
                  </Stack>
                  <Stack className="option">
                    <img src="/img/icons/type.png" alt="" /> <Typography>{watch?.watchType}</Typography>
                  </Stack>
                  <Stack className="option">
                    <img src="/img/icons/size.png" alt="" /> <Typography>{watch?.caseDiameter} mm</Typography>
                  </Stack>
                </Stack>
              </Stack>

              <Stack className="right-box">
                <Stack className="buttons">
                  <Stack className="button-box">
                    <RemoveRedEyeIcon fontSize="medium" />
                    <Typography>{watch?.watchViews}</Typography>
                  </Stack>
                  <Stack className="button-box">
                    {watch?.meLiked && watch?.meLiked[0]?.myFavorite ? (
                      <FavoriteIcon
                        color="primary"
                        fontSize="medium"
                        onClick={() => likeWatchHandler(user, watch?._id || '')}
                        style={{ cursor: 'pointer' }}
                        aria-label="Unlike"
                        titleAccess="Unlike"
                      />
                    ) : (
                      <FavoriteBorderIcon
                        fontSize="medium"
                        onClick={() => likeWatchHandler(user, watch?._id || '')}
                        style={{ cursor: 'pointer' }}
                        aria-label="Like"
                        titleAccess="Like"
                      />
                    )}
                    <Typography>{watch?.likes}</Typography>
                  </Stack>
                </Stack>
                <Typography>${formatterStr(watch?.price)}</Typography>
              </Stack>
            </Stack>

            <Stack className="images">
              <Stack className="main-image">
                <img
                  src={slideImage ? `${REACT_APP_API_URL}/${slideImage}` : '/img/watch/bigImage.png'}
                  alt="main-image"
                />
              </Stack>
              <Stack className="sub-images">
                {watch?.images.map((subImg: string) => {
                  const imagePath: string = `${REACT_APP_API_URL}/${subImg}`;
                  return (
                    <Stack className="sub-img-box" onClick={() => changeImageHandler(subImg)} key={subImg}>
                      <img src={imagePath} alt="sub-image" />
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </Stack>

          <Stack className="property-desc-config">
            <Stack className="left-config">
              <Stack className="options-config">
                <Stack className="option">
                  <Stack className="svg-box">
                    <img src="/img/icons/movement.png" alt="movement" />
                  </Stack>
                  <Stack className="option-includes">
                    <Typography className="title">Movement</Typography>
                    <Typography className="option-data">{watch?.movement ?? '—'}</Typography>
                  </Stack>
                </Stack>

                <Stack className="option">
                  <Stack className="svg-box">
                    <img src="/img/icons/type.png" alt="type" />
                  </Stack>
                  <Stack className="option-includes">
                    <Typography className="title">Type</Typography>
                    <Typography className="option-data">{watch?.watchType ?? '—'}</Typography>
                  </Stack>
                </Stack>

                <Stack className="option">
                  <Stack className="svg-box">
                    <img src="/img/icons/origin.png" alt="origin" />
                  </Stack>
                  <Stack className="option-includes">
                    <Typography className="title">Origin</Typography>
                    <Typography className="option-data">{watch?.watchOrigin ?? '—'}</Typography>
                  </Stack>
                </Stack>

                <Stack className="option">
                  <Stack className="svg-box">
                    <img src="/img/icons/size.png" alt="size" />
                  </Stack>
                  <Stack className="option-includes">
                    <Typography className="title">Size</Typography>
                    <Typography className="option-data">
                      {watch?.caseDiameter ? `${watch.caseDiameter} mm` : '—'}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>

              <Stack className="prop-desc-config">
                <Stack className="top">
                  <Typography className="title">Watch Description</Typography>
                  <Typography className="desc">{watch?.description ?? 'No Description!'}</Typography>
                </Stack>

                <Stack className="bottom">
                  <Typography className="title">Watch Details</Typography>
                  <Stack className="info-box">
                    <Stack className="left">
                      <Box component="div" className="info">
                        <Typography className="title">Price</Typography>
                        <Typography className="data">${formatterStr(watch?.price)}</Typography>
                      </Box>
                      <Box component="div" className="info">
                        <Typography className="title">Size</Typography>
                        <Typography className="data">
                          {watch?.caseDiameter ? `${watch.caseDiameter} mm` : '—'}
                        </Typography>
                      </Box>
                      <Box component="div" className="info">
                        <Typography className="title">Movement</Typography>
                        <Typography className="data">{watch?.movement ?? '—'}</Typography>
                      </Box>
                      <Box component="div" className="info">
                        <Typography className="title">Type</Typography>
                        <Typography className="data">{watch?.watchType ?? '—'}</Typography>
                      </Box>
                    </Stack>

                    <Stack className="right">
                      <Box component="div" className="info">
                        <Typography className="title">Year Released</Typography>
                        <Typography className="data">{moment(watch?.createdAt).format('YYYY')}</Typography>
                      </Box>
                      <Box component="div" className="info">
                        <Typography className="title">Origin</Typography>
                        <Typography className="data">{watch?.watchOrigin ?? '—'}</Typography>
                      </Box>
                      <Box component="div" className="info">
                        <Typography className="title">Edition</Typography>
                        <Typography className="data">
                          {watch?.isLimitedEdition ? 'Limited Special' : '—'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>

              <Stack className="floor-plans-config">
                <Typography className="title">Watch Certificate</Typography>
                <Stack className="image-box">
                  <img src="/img/watch/certificate.png" alt="image" />
                </Stack>
              </Stack>

              <Stack className="address-config">
                <Typography className="title">Showroom Address</Typography>
                <Stack className="map-box">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25867.098915951767!2d128.68632810247993!3d35.86402299180927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35660bba427bf179%3A0x1fc02da732b9072f!2sGeumhogangbyeon-ro%2C%20Dong-gu%2C%20Daegu!5e0!3m2!1suz!2skr!4v1695537640704!5m2!1suz!2skr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </Stack>
              </Stack>

              {commentTotal !== 0 && (
                <Stack className="reviews-config">
                  <Stack className="filter-box">
                    <Stack className="review-cnt">
                      <Typography className="reviews">{commentTotal} reviews</Typography>
                    </Stack>
                  </Stack>
                  <Stack className="review-list">
                    {watchComments?.map((comment: Comment) => {
                      return <Review comment={comment} key={comment?._id} />;
                    })}
                    <Box component="div" className="pagination-box">
                      <MuiPagination
                        page={commentInquiry.page}
                        count={Math.ceil(commentTotal / commentInquiry.limit)}
                        onChange={commentPaginationChangeHandler}
                        shape="circular"
                        color="primary"
                      />
                    </Box>
                  </Stack>
                </Stack>
              )}

              <Stack className="leave-review-config">
                <Typography className="main-title">Leave A Review</Typography>
                <Typography className="review-title">Review</Typography>
                <textarea
                  onChange={({ target: { value } }: any) => {
                    setInsertCommentData({ ...insertCommentData, commentContent: value });
                  }}
                  value={insertCommentData.commentContent}
                ></textarea>
                <Box className="submit-btn" component="div">
                  <Button
                    className="submit-review"
                    disabled={insertCommentData.commentContent === '' || user?._id === ''}
                    onClick={createCommentHandler}
                  >
                    <Typography className="title">Submit Review</Typography>
                  </Button>
                </Box>
              </Stack>
            </Stack>

            <Stack className="right-config">
              <Stack className="info-box">
                <Typography className="main-title">Get More Information</Typography>
                <Stack className="image-info">
                  <img
                    className="member-image"
                    src={
                      watch?.memberData?.memberImage
                        ? `${REACT_APP_API_URL}/${watch?.memberData?.memberImage}`
                        : '/img/profile/defaultUser.svg'
                    }
                  />
                  <Stack className="name-phone-listings">
                    <Link href={`/member?memberId=${watch?.memberData?._id}`}>
                      <Typography className="name">{watch?.memberData?.memberNick}</Typography>
                    </Link>
                    <Stack className="phone-number">
                      <Typography className="number">{watch?.memberData?.memberPhone}</Typography>
                    </Stack>
                    <Typography className="listings">View Listings</Typography>
                  </Stack>
                </Stack>
              </Stack>

              <Stack className="info-box">
                <Typography className="sub-title">Name</Typography>
                <input type="text" placeholder="Enter your name" />
              </Stack>
              <Stack className="info-box">
                <Typography className="sub-title">Phone</Typography>
                <input type="text" placeholder="Enter your phone" />
              </Stack>
              <Stack className="info-box">
                <Typography className="sub-title">Email</Typography>
                <input type="text" placeholder="creativelayers088" />
              </Stack>
              <Stack className="info-box">
                <Typography className="sub-title">Message</Typography>
                <textarea placeholder={'Hello, I am interested in \n' + '[This luxury watch]'}></textarea>
              </Stack>
              <Stack className="info-box">
                <Button className="send-message">
                  <Typography className="title">Send Message</Typography>
                </Button>
              </Stack>
            </Stack>
          </Stack>

          {destinationWatches.length !== 0 && (
            <Stack className="similar-properties-config">
              <Stack className="title-pagination-box">
                <Stack className="title-box">
                  <Typography className="main-title">Similar Watches</Typography>
                  <Typography className="sub-title">You may also like</Typography>
                </Stack>
                <Stack className="pagination-box">
                  <WestIcon className="swiper-similar-prev" />
                  <div className="swiper-similar-pagination"></div>
                  <EastIcon className="swiper-similar-next" />
                </Stack>
              </Stack>
              <Stack className="cards-box">
                <Swiper
                  className="similar-homes-swiper"
                  slidesPerView="auto"
                  spaceBetween={35}
                  modules={[Autoplay, Navigation, Pagination]}
                  navigation={{
                    nextEl: '.swiper-similar-next',
                    prevEl: '.swiper-similar-prev',
                  }}
                  pagination={{
                    el: '.swiper-similar-pagination',
                  }}
                >
                  {destinationWatches.map((dw: Watch) => {
                    return (
                      <SwiperSlide className="similar-homes-slide" key={dw.modelName}>
                        <PropertyBigCard watch={dw} likeWatchHandler={likeWatchHandler} key={dw?._id} user={userVar()} />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </Stack>
            </Stack>
          )}
        </Stack>
      </div>
    </div>
  );
};

WatchDetail.defaultProps = {
  initialComment: {
    page: 1,
    limit: 5,
    sort: 'createdAt',
    direction: 'DESC',
    search: {
      commentRefId: '',
    },
  },
};

export default withLayoutFull(WatchDetail);
