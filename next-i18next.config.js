module.exports = {
	i18n: {
		defaultLocale: 'en',
		locales: ['en', 'kr', 'ru'],
		localeDetection: false,
	},
	trailingSlash: true,
	localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/public/locales'
};
