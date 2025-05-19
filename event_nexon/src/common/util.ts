import * as dayjs from 'dayjs';

export const getNow = (str: string = 'YYYY-MM-DD HH:mm:ss') => {
	return dayjs().format(str);
};

// 날짜 비교
export const dayDiff = (date: Date) => {
	const now = dayjs();
	return now.diff(date, 'M');
};

// 날짜 비교
export const dayBefore = (date: Date) => {
	const now = dayjs();
	return now.isBefore(date);
};
// 등급
export const getGrade = (grade: string) => {
	const login_grade = { user: 1, operator: 2, auditor: 3 };
	return login_grade[grade] ?? null;
};
// 획득 조건
export const provideReason = (action: string) => {
	const provide_action = { quiz: 'quiz', rand: 'rand' };
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
export const quiz = () => {
	const ql = [
		{ question: '코끼리는 점프를 할 수 없는 유일한 포유류다.', result: true },
		{ question: '하이힐을 많이 신으면 다리가 길어진다.', result: false },
		{ question: '소는 하루에 6번의 대변을 본다.', result: false },
		{ question: '성경에 유일하게 기록되지 않은 가축은 고양이다.', result: true },
		{ question: '하마의 땀은 보라색이다', result: false },
		{ question: '코끼리는 쥐를 무서워한다.', result: true },
		{ question: '스페인의 국가는 가사가 없다.', result: true },
		{ question: '나폴레옹의 키는 167이다.', result: true },
		{ question: '소닉 CD 아무것도 안하고 오래~ 기다리면 "나 여기서 나갈래" 라고 하면서 자살한다.', result: true },
		{ question: '80%의 박테리아가 인간에게 질병을 가져온다.', result: false },
		{ question: '전세계적으로 하루에 스팸 뚜껑한개씩 열리고있다.', result: false },
	];
	return ql[Math.floor(Math.random() * ql.length)];
};
export const rand = () => {
	const ql = [
		{ question: '6.25전쟁이 일어난 년도는 ? (숫자로만)', result: '1950' },
		{ question: '국보1호였던 문화재의 이름은?.', result: '숭례문' },
		{ question: '우리나라 최초의 한글소설은?.', result: '홍길동전' },
		{ question: '가장 많은 언어를 번역한 책은?.', result: '성서' },
		{ question: '세계에서 가장 많이 팔린 책은?', result: '성경' },
		{ question: '세계에서 가장 큰 동물은?', result: '블루고래' },
		{ question: '구명보트에는 몇명이 탈 수 있을까?', result: '9명' },
		{ question: '가장 많은 올림픽메달을 획득한 국가는?', result: '미국' },
		{ question: '진짜 새의 이름은?', result: '참새' },
		{ question: '사람의 몸무게가 가장 많이 나갈 때는?', result: '철들때' },
	];
	return ql[Math.floor(Math.random() * ql.length)];
};
