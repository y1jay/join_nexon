import * as dayjs from 'dayjs';

export const getNow = (str: string = 'YYYY-MM-DD HH:mm:ss') => {
	return dayjs().format(str);
};

// 날짜 비교
export const dayDiff = (leave_date: Date) => {
	const now = dayjs();
	return now.diff(leave_date, 'month');
};

