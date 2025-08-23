import React from 'react';
import { Box, Stack, Typography, Button, IconButton } from '@mui/material';
import Link from 'next/link';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Member } from '../../types/member/member';

const rolexGreen = '#267147';

interface StoreCardProps {
	store: Member;
	likeMemberHandler: any;
}

const StoreCard = ({ store, likeMemberHandler }: StoreCardProps) => {
	const user = useReactiveVar(userVar);

	// Pick main image or fallback
	const imagePath =
		Array.isArray(store?.memberImage)
			? (store.memberImage[0] && store.memberImage[0] !== ''
				? store.memberImage[0]
				: '/img/logo/defaultBack.jpeg')
			: (store?.memberImage && store.memberImage !== ''
				? store.memberImage
				: '/img/logo/defaultBack.jpeg');

	// Watches count as number
	let watchesCount = 0;

	if (typeof store?.storeWatches === 'number') {
		watchesCount = store.storeWatches;
	} else if (typeof store?.storeWatches === 'string') {
		// If it's a string that represents a number
		watchesCount = Number(store.storeWatches) || 0;
	} else if (Array.isArray(store?.storeWatches)) {
		watchesCount = (store.storeWatches as any[]).length;
	} else {
		watchesCount = 0;
	}




	// Date string (use createdAt or updatedAt if available, else today)
	const dateStr = store?.createdAt
		? new Date(store.createdAt).toLocaleDateString('en-US', {
			month: 'short',
			day: '2-digit',
			year: 'numeric',
		})
		: new Date().toLocaleDateString('en-US', {
			month: 'short',
			day: '2-digit',
			year: 'numeric',
		});

	return (
		<Box className="topstore-card">
			{/* Left: image + store name */}
			<Box className="topstore-imgbox">
				<img
					src={imagePath}
					alt={store?.memberNick}
					className="topstore-img"
					loading="lazy"
				/>
				<span className="topstore-imgname">{store?.memberFullName ?? store?.memberNick}</span>
			</Box>
			{/* Right: info */}
			<Stack className="topstore-infobox">
				<Typography className="topstore-date">{dateStr}</Typography>
				<Typography className="topstore-title">{store?.memberFullName ?? store?.memberNick}</Typography>
				<Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
					<Typography className="topstore-watches">
						Watches: <span>{watchesCount}</span>
					</Typography>
				</Stack>
				<Link
					href={{
						pathname: '/store/detail',
						query: { storeId: store?._id },
					}}
					style={{ textDecoration: 'none', marginTop: 18 }}
				>
					<Button
						variant="contained"
						className="topstore-more"
						sx={{
							bgcolor: rolexGreen,
							color: '#fff',
							borderRadius: 50,
							px: 3.2,
							py: 1.2,
							fontWeight: 700,
							fontSize: 17,
							letterSpacing: 0.1,
							textTransform: 'capitalize',
							boxShadow: '0 2px 8px 0 #e5eee9',
							'&:hover': { bgcolor: '#1a5132' },
						}}
					>
						More Info
					</Button>
				</Link>
				{/* Like/views row */}
				<Stack direction="row" alignItems="center" spacing={2} className="topstore-stats">
					<Stack direction="row" alignItems="center" spacing={0.8}>
						<RemoveRedEyeIcon sx={{ color: rolexGreen, fontSize: 22 }} />
						<Typography className="topstore-statnum">{store?.memberViews ?? 0}</Typography>
					</Stack>
					<Stack direction="row" alignItems="center" spacing={0.8}>
						<IconButton
							sx={{ color: rolexGreen, p: '2px' }}
							onClick={() => likeMemberHandler(user, store?._id)}
						>
							{store?.meLiked && store?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon sx={{ color: rolexGreen }} />
							) : (
								<FavoriteBorderIcon sx={{ color: rolexGreen }} />
							)}
						</IconButton>
						<Typography className="topstore-statnum">{store?.memberLikes ?? 0}</Typography>
					</Stack>
				</Stack>
			</Stack>
		</Box>
	);
};

export default StoreCard;
