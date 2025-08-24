import { NextPage } from 'next';
import useDeviceDetect from '../libs/hooks/useDeviceDetect';
import CommunityBoards from '../libs/components/homepage/CommunityBoards';
import { Stack } from '@mui/material';
import Collection from '../libs/components/homepage/Collection';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import withLayoutMain from '../libs/components/layout/LayoutHome';
import HeroSection from '../libs/components/homepage/Events';
import TrendWatches from '../libs/components/homepage/TrendWatches';
import StorePage from '../libs/components/homepage/CollectionPage';
import AboutStore from '../libs/components/homepage/AboutStore';
import CollectionPage from '../libs/components/homepage/CollectionPage';
import TopStores from '../libs/components/homepage/TopStores';
import HomePersonalizedSlider from '../libs/components/homepage/MyFvRv';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Home: NextPage = () => {
	const device = useDeviceDetect();

	if (device === 'mobile') {
		return (
			<Stack className={'home-page'}>
				<TrendWatches />
				<StorePage />
				<TrendWatches />
				<CommunityBoards />
				<AboutStore />
			</Stack>
		);
	} else {
		return (
			<Stack className={'home-page'}>
				<Collection />
				<HomePersonalizedSlider />
				<HeroSection />
				<TrendWatches  />
				<CollectionPage />
				<TopStores />
				<CommunityBoards />
				<AboutStore />
			</Stack>
		);
	}
};

export default withLayoutMain(Home);