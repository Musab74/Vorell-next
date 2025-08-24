// libs/components/property/Review.tsx
import React from 'react';
import { Stack, Typography, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Comment } from '../../types/comment/comment';
import { NEXT_APP_API_URL } from '../../config';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface ReviewProps {
  comment: Comment;
}

const Review = ({ comment }: ReviewProps) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);

  const imagePath: string = comment?.memberData?.memberImage
    ? `${NEXT_APP_API_URL}/${comment?.memberData?.memberImage}`
    : '/img/profile/defaultUser.svg';

  /** HANDLERS **/
  const goMemberPage = (id: string) => {
    if (!id) return;
    if (id === user?._id) router.push('/mypage');
    else router.push(`/member?memberId=${id}`);
  };

  if (device === 'mobile') {
    return <div>REVIEW</div>;
  }

  // Luxury gold (adjust if needed)
  const gold = '#bfa15e';

  return (
    <Stack
      component="div"
      className="review-watch-config"
      sx={{
        background: '#fffdfa',
        borderRadius: '22px',
        boxShadow: '0 2px 28px 0 rgba(186,165,125,0.08)',
        p: '22px 34px',
        mb: 2,
        border: `1px solid #f2e6d7`,
      }}
    >
      <Stack
        component="div"
        className="review-watch-mb-info"
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{ mb: 1 }}
      >
        <Box
          component="div"
          sx={{
            width: 62,
            height: 62,
            borderRadius: '50%',
            overflow: 'hidden',
            border: `2px solid ${gold}`,
            mr: 2,
            background: '#f7f2e8',
            boxShadow: '0 1px 8px 0 rgba(186,165,125,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <img
            src={imagePath}
            alt={comment.memberData?.memberNick}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
          />
        </Box>

        <Stack component="div">
          <Typography
            className="name"
            onClick={() => goMemberPage(comment?.memberData?._id as string)}
            sx={{
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 17,
              letterSpacing: '.02em',
              color: gold,
              fontFamily: `'Playfair Display', serif`,
              transition: 'color .18s',
              '&:hover': {
                color: '#222',
                textDecoration: 'underline',
              },
            }}
          >
            {comment.memberData?.memberNick}
          </Typography>
          <Typography
            className="date"
            sx={{ color: '#88806b', fontSize: 13, mt: 0.3, fontFamily: `'Inter', serif` }}
          >
            <Moment format="DD MMM, YYYY">{comment.createdAt}</Moment>
          </Typography>
        </Stack>
      </Stack>

      <Stack component="div" className="desc-box" sx={{ mt: 0.5 }}>
        <Typography
          className="description"
          sx={{
            fontSize: 16,
            color: '#29230f',
            fontFamily: `'Inter', serif`,
            background: '#f7f6ef',
            borderRadius: '14px',
            padding: '16px 22px',
            fontWeight: 500,
            letterSpacing: '0.01em',
            boxShadow: '0 1px 6px 0 rgba(186,165,125,0.07)',
            border: `1px solid #f3e6c1`,
          }}
        >
          {comment.commentContent}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default Review;
