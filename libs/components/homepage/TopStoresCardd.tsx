import React from 'react';
import { useRouter } from 'next/router';
import { Member } from '../../types/member/member';

const rolexGreen = "#217A3E";

const formatDate = (iso?: string) => {
	if (!iso) return '';
	const date = new Date(iso);
	return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
};

const ellipsis = (text?: string, max = 80) => {
	if (!text) return '';
	return text.length > max ? text.substring(0, max) + '...' : text;
};

interface TopStoreCardProps {
	store: Member;
}

const TopStoreCard: React.FC<TopStoreCardProps> = ({ store }) => {
	const router = useRouter();
	const storeImage = store?.memberImage
		? `${process.env.REACT_APP_API_GRAPHQL_URL}/${store.memberImage} !== "" `
		: '/img/logo/RolexStore.jpeg';

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'stretch',
				background: '#fff',
				borderRadius: 28,
				boxShadow: '0 4px 20px 0 rgba(33,122,62,0.12)',
				overflow: 'hidden',
				width: 640,
				maxWidth: '100%',
				margin: '0 auto',
				minHeight: 250,
				border: `1.5px solid #e4ede7`,
				transition: 'box-shadow .2s,border .2s',
			}}
		>
			{/* Image */}
			<div
				style={{
					flex: '0 0 240px',
					background: '#f4f7f4',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					borderRadius: '28px 0 0 28px',
					overflow: 'hidden',
				}}
			>
				<img
					src={storeImage}
					alt={store?.memberNick}
					style={{
						width: 220,
						height: 220,
						objectFit: 'cover',
						borderRadius: 20,
						margin: 10,
						background: '#edf4ee',
						border: `1.5px solid ${rolexGreen}`,
					}}
				/>
			</div>
			{/* Content */}
			<div style={{ flex: 1, padding: '36px 36px 36px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
				{/* Registered date */}
				<div style={{ color: rolexGreen, fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
					{formatDate(store?.createdAt)} <span style={{ fontWeight: 400, color: "#888" }}>— Registered</span>
				</div>

				{/* Name */}
				<div style={{ fontWeight: 800, fontSize: 24, color: '#181a20', marginBottom: 8, fontFamily: 'inherit' }}>
					{store?.memberNick}
				</div>
				{/* Description */}
				<div style={{ color: '#232323', fontSize: 16, fontWeight: 400, marginBottom: 18, maxWidth: 420 }}>
					{ellipsis(store?.memberDesc, 90)}
				</div>
				{/* Watches & More info row */}
				<div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
					<div style={{ color: rolexGreen, fontSize: 16, fontWeight: 700 }}>
						Watches: <span style={{ color: '#181a20', fontWeight: 800 }}>{store?.storeWatches ?? 0}</span>
					</div>
					<button
						style={{
							background: rolexGreen,
							color: '#fff',
							border: 'none',
							borderRadius: 22,
							fontWeight: 700,
							fontSize: 17,
							padding: '10px 36px',
							cursor: 'pointer',
							transition: 'background 0.2s,box-shadow 0.2s',
							boxShadow: '0 2px 12px 0 rgba(33,122,62,0.09)',
							marginLeft: 10,
							letterSpacing: ".5px"
						}}
						onClick={() => router.push(`/agent/detail/${store?._id}`)}
						onMouseOver={e => (e.currentTarget.style.background = "#005436")}
						onMouseOut={e => (e.currentTarget.style.background = rolexGreen)}
					>
						More Info
					</button>
				</div>
			</div>
		</div>
	);
};

export default TopStoreCard;
