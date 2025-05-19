import * as dayjs from 'dayjs';

export const getNow = (str: string = 'YYYY-MM-DD HH:mm:ss') => {
	return dayjs().format(str);
};

// 날짜 비교
export const dayDiff = (leave_date: Date) => {
	const now = dayjs();
	return now.diff(leave_date, 'month');
};
// 등급
export const getGrade = (grade: string) => {
	const login_grade = { user: 1, operator: 2, auditor: 3 };
	return login_grade[grade] ?? null;
};
// 획득 조건
export const provideReason = (action: string) => {
	const provide_action = { quiz: 'quiz', rand: 'rand', mix: 'mix' };
	return provide_action[action] ?? null;
};
// 아이템 종류
export const itemType = (item: string) => {
	const item_type = {
		potion: [
			{ name: 'HP', effect: [{ hp: 100 }] },
			{ name: 'MP', effect: [{ mp: 100 }] },
			{ name: 'EXP', effect: [{ exp: 50000 }] },
		],
		wappon: [
			{ name: 'sord', effect: [{ attr: 500 }] },
			{ name: 'knuckles', effect: [{ lux: 200 }] },
			{ name: 'bow', effect: [{ dex: 200 }] },
		],
		armor: [
			{ name: 'hat', effect: [{ hp: 200, attr: 10 }] },
			{ name: 'top', effect: [{ hp: 100, dex: 20 }] },
			{ name: 'bottom', effect: [{ hp: 100, attr: 20 }] },
		],
		accessories: [
			{ name: 'ring', effect: [{ lux: 10 }] },
			{ name: 'earring', effect: [{ dex: 10 }] },
			{ name: 'necklace', effect: [{ attr: 10 }] },
		],
	};
	return item_type[item] ?? null;
};

