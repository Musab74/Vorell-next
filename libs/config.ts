export const NEXT_APP_API_URL = `${process.env.NEXT_APP_API_URL}`;

// Available options for watch filters (customize as needed)
export const availableWatchOptions = ['isLimitedEdition', 'waterResistance'];

// Years for watch release filters
const thisYear = new Date().getFullYear();
export const watchYears: number[] = [];
for (let i = 2000; i <= thisYear; i++) {
	watchYears.push(Number(i));
}

// Diameters for watch case filter (in mm)
export const watchDiameters = [28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48];

// Price steps for watch price filters
export const watchPriceSteps = [0, 1000, 5000, 10000, 20000, 50000, 100000, 500000];

export const Messages = {
	error1: 'Something went wrong!',
	error2: 'Please login first!',
	error3: 'Please fulfill all inputs!',
	error4: 'Message is empty!',
	error5: 'Only images with jpeg, jpg, png format allowed!',
};

// Used for showing or filtering top watches by rank, adjust as needed
export const topWatchRank = 2;
