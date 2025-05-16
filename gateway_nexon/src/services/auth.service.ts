import { BadRequestException, Injectable, UnauthorizedException, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
@Injectable()
export class AuthService {
	constructor(private readonly jwt: JwtService) {}

	async logIn(data: any): Promise<any> {
		// const { req, res, ip } = data;
		// let deviceUuid = req.headers.cookie?.split(';').filter((e) => e.trim().startsWith('deviceUuid='));
		// deviceUuid = (deviceUuid && deviceUuid.length > 0 && deviceUuid[0].replace('deviceUuid=', '')) ?? '';
		// const user = { ...req.user, deviceUuid: deviceUuid };
		// // console.log(user, "DAATA!!@!#!#@!");
		// const memberSelectOne = await selectQuery(() =>
		// 	this.memberRepository
		// 		.createQueryBuilder('mm')
		// 		.select([
		// 			'mmIdx',
		// 			'loginType',
		// 			'uid',
		// 			'email',
		// 			'nick',
		// 			'profileImageUrl',
		// 			'ifnull((select stateCode from MemberSanctionHistory msh where msh.mmIdx = mm.mmIdx and useYn = 1),mm.stateCode)as stateCode',
		// 			// "stateCode",
		// 			'gradeCode',
		// 			'userExp',
		// 			'freePoint',
		// 			// "silverboxCnt",
		// 			'goldboxCnt',
		// 			`(SELECT codeName FROM CommonCode WHERE codeKey = 'membershipGrade' AND codeValue = mm.gradeCode AND displayYn = 1 AND useYn = 1) AS gradeName`,
		// 			`(SELECT COUNT(1) FROM PresentUniqueMaster WHERE mmIdx = mm.mmIdx AND useYn = 1) AS inventoryPresentCnt`,
		// 		])
		// 		.where({
		// 			stateCode: In(['01', '02', '11', '12']),
		// 			joinChannelCode: user.joinChannelCode,
		// 			uid: user.uid,
		// 		})
		// 		.getRawOne()
		// );
		// console.log(memberSelectOne, 'MEMBERLIST!!!');
		// if (!memberSelectOne) {
		// 	// console.log("SIGNIN!!!!!!!");
		// 	const sign = await transaction(this.dataSource, async (con: any) => {
		// 		let result: User;
		// 		const memberLeaveSelectOne = await selectQuery(() =>
		// 			con
		// 				.getRepository(MemberMaster)
		// 				.createQueryBuilder()
		// 				.select([
		// 					`(CASE DATE_FORMAT(SUBSTRING(leaveDt, 1, 8), '%Y-%m-%d') > DATE_FORMAT(DATE_ADD(now(), INTERVAL -60 DAY), '%Y-%m-%d') WHEN 1 THEN 1 ELSE 0 END) leaveYn`,
		// 					`DATE_FORMAT(DATE_ADD(SUBSTRING(leaveDt, 1, 8), INTERVAL 60 DAY), '%Y%m%d') AS canJoinDt`,
		// 				])
		// 				.where({
		// 					stateCode: '-999',
		// 					joinChannelCode: user.joinChannelCode,
		// 					uid: user.uid,
		// 				})
		// 				.orderBy('leaveDt', 'DESC')
		// 				.getRawOne()
		// 		);
		// 		console.log(memberLeaveSelectOne, '!@#!#!@#@!#@!');
		// 		if (memberLeaveSelectOne && memberLeaveSelectOne.leaveYn === 1) {
		// 			const result = {
		// 				canJoinDt: memberLeaveSelectOne.canJoinDt,
		// 				code: '-900',
		// 			};
		// 			if (user.joinChannelCode == '04') {
		// 				const appleUnlink = await this.unlinkApple(user.refreshToken);
		// 				console.log(appleUnlink, 'APPLE UNLINK!');
		// 			}
		// 			const _json = encode(JSON.stringify(result));
		// 			return res.render('postMessage', { result: _json });
		// 			// throw new BadRequestException(
		// 			// 	`탈퇴한 동일 계정으로\n60일동안 재가입이 불가능합니다.\n\n재가입 가능 일자 : ${memberLeaveSelectOne.canJoinDt}`,
		// 			// 	"재가입 제한 안내"
		// 			// );
		// 		}
		// 		const memberInsert = await insertQuery(con.getRepository(MemberMaster), {
		// 			joinChannelCode: user.joinChannelCode,
		// 			hp: '',
		// 			email: user.email,
		// 			pw: '',
		// 			name: user.name ?? '',
		// 			nick: user.nick,
		// 			profileImageUrl: user.profileImageUrl,
		// 			stateCode: '01',
		// 			gradeCode: '0',
		// 			userExp: 0,
		// 			freePoint: 0,
		// 			useAgreeYn: 0,
		// 			financialAgreeYn: 0,
		// 			privacyAgreeYn: 0,
		// 			mailSendYn: 0,
		// 			smsSendYn: 0,
		// 			ageOverYn: 0,
		// 			joinDt: getNow(),
		// 			modDt: getNow(),
		// 			joinIp: ip,
		// 			leaveDt: 0,
		// 			leaveIp: '',
		// 			loginType: user.loginType,
		// 			loginTypeCode: user.joinChannelCode,
		// 			uid: user.uid,
		// 		});
		// 		// 로그인 이력
		// 		let token: string;
		// 		if (!user.accessToken) {
		// 			user.accessToken = this.jwt.sign(user, {
		// 				expiresIn: baseConfig.jwt.expiresIn.accessToken,
		// 			});
		// 		} else {
		// 			user.accessToken = this.jwt.sign(user, {
		// 				expiresIn: baseConfig.jwt.expiresIn.accessToken,
		// 			});
		// 		}
		// 		if (!user.refreshToken) {
		// 			user.refreshToken = this.jwt.sign(user, {
		// 				expiresIn: baseConfig.jwt.expiresIn.refreshToken,
		// 			});
		// 		} else {
		// 			user.refreshToken = this.jwt.sign(user, {
		// 				expiresIn: baseConfig.jwt.expiresIn.refreshToken,
		// 			});
		// 		}
		// 		// console.log(memberInsert, "WAEFEFEFWFEWFWFWEEW");
		// 		const insertInfo = memberInsert.generatedMaps[0];
		// 		result = {
		// 			...user,
		// 			mmIdx: memberInsert.raw.insertId,
		// 			referralCode: insertInfo.referralCode,
		// 			stateCode: insertInfo.stateCode,
		// 			freePoint: insertInfo.stateCode,
		// 			goldboxCnt: insertInfo.goldboxCnt,
		// 			deviceUuid: deviceUuid,
		// 			// silverboxCnt: insertInfo.silverboxCnt,
		// 		};
		// 		await insertQuery(con.getRepository(MemberLoginHistory), {
		// 			mmIdx: memberInsert.raw.insertId,
		// 			loginIp: ip,
		// 			loginDt: getNow(),
		// 			type: 'new',
		// 			loginType: user.loginType,
		// 			accessToken: user.accessToken,
		// 			refreshToken: user.refreshToken,
		// 			deviceUuid: deviceUuid,
		// 		});
		// 		console.log(user.accessToken, 'LOGIN ACCESSTOKEN');
		// 		// result.push({
		// 		// 	user: user,
		// 		// 	member: memberInsert.generatedMaps,
		// 		// 	accessToken: user.accessToken,
		// 		// 	refreshToken: user.refreshToken,
		// 		// });
		// 		req.user = result;
		// 		// 쿠키에 토큰정보 셋팅
		// 		res.cookie(
		// 			'Authorization',
		// 			{
		// 				accessToken: user.accessToken,
		// 				refreshToken: user.refreshToken,
		// 			},
		// 			{
		// 				httpOnly: true,
		// 				path: '/',
		// 				maxAge: baseConfig.cookieAge, //1 day
		// 			}
		// 		);
		// 		res.header({
		// 			Authorization: {
		// 				accessToken: user.accessToken,
		// 				refreshToken: user.refreshToken,
		// 			},
		// 		});
		// 		// console.log(req.headers, "FEFWFWE");
		// 		// console.log(req.headers, "FEFWFWE");
		// 		// return [result];
		// 		const _json = encode(JSON.stringify(result));
		// 		res.render('postMessage', { result: _json });
		// 		// return [result];
		// 	});
		// 	// return res.redirect(
		// 	// 	`${baseConfig.host}/MEMB001001?${JSON.stringify({
		// 	// 		accessToken: user.accessToken,
		// 	// 		refreshToken: user.refreshToken,
		// 	// 	})}`
		// 	// );
		// 	// return res.json(sign[0]);
		// } else {
		// 	// 제재계정 제한
		// 	// console.log(memberSelectOne.stateCode, "!@#@!#!@@!!!!!!!!!!!!");
		// 	console.log('LOG!IN!!!!!!!');
		// 	if (Number(memberSelectOne.stateCode) < 0) {
		// 		const memberSanctionSelect = await this.memberSanctionHistory.find({
		// 			where: {
		// 				mmIdx: user.mmIdx,
		// 				useYn: 1,
		// 				sanctionStDt: LessThanOrEqual(Number(getNow())),
		// 				sanctionEndDt: MoreThanOrEqual(Number(getNow())),
		// 			},
		// 		});
		// 		if (memberSanctionSelect) {
		// 			throw new BadRequestException('제재 된 계정입니다.', '-401');
		// 		}
		// 	}
		// 	const accessToken = this.jwt.sign(user, {
		// 		expiresIn: baseConfig.jwt.expiresIn.accessToken,
		// 	});
		// 	const refreshToken = this.jwt.sign(
		// 		{
		// 			user,
		// 			expiredDt: getExpireTime(baseConfig.jwt.expiresIn.refreshToken),
		// 		},
		// 		{ expiresIn: baseConfig.jwt.expiresIn.refreshToken }
		// 	);
		// 	const memberLoginHistorySelectOne = await selectQuery(() =>
		// 		this.memberLoginHistoryRepository
		// 			.createQueryBuilder()
		// 			.select(['mmIdx', 'loginIp', 'loginDt', 'deviceUuid', 'type'])
		// 			.where({
		// 				mmIdx: memberSelectOne.mmIdx,
		// 				type: Not('logout'),
		// 			})
		// 			.orderBy('mlhIdx', 'DESC')
		// 			.getRawOne()
		// 	);
		// 	// 추후 프론트 적용 시 작업
		// 	// if (
		// 	// 	memberLoginHistorySelectOne &&
		// 	// 	memberLoginHistorySelectOne.deviceUuid != "" &&
		// 	// 	memberLoginHistorySelectOne.deviceUuid !== deviceUuid
		// 	// ) {
		// 	// 	// 중복 로그인
		// 	// 	// res.header({
		// 	// 	// 	user: {
		// 	// 	// 		accessToken: accessToken,
		// 	// 	// 		refreshToken: refreshToken,
		// 	// 	// 	},
		// 	// 	// });
		// 	// 	const result = {
		// 	// 		duplicate: 1,
		// 	// 		accessToken: accessToken,
		// 	// 	};
		// 	// 	const _json = encode(JSON.stringify(result));
		// 	// 	return res.render("postMessage", { result: _json });
		// 	// 	// throw new BadRequestException("-999", "이미 로그인중입니다");
		// 	// }
		// 	// console.log(user, "USER!!!!");
		// 	console.log(accessToken, 'JOIN ACCESSTOKEN!!');
		// 	await insertQuery(this.memberLoginHistoryRepository, {
		// 		mmIdx: memberSelectOne.mmIdx,
		// 		loginIp: ip,
		// 		loginDt: getNow(),
		// 		type: 'reLogin',
		// 		loginType: memberSelectOne.loginType,
		// 		accessToken: accessToken,
		// 		refreshToken: refreshToken,
		// 		deviceUuid: deviceUuid,
		// 	});
		// 	// res.cookie(
		// 	// 	"Authorization",
		// 	// 	{
		// 	// 		accessToken: accessToken,
		// 	// 		refreshToken: refreshToken,
		// 	// 	},
		// 	// 	{
		// 	// 		httpOnly: true,
		// 	// 		path: "/",
		// 	// 		maxAge: baseConfig.cookieAge, //1 day
		// 	// 	}
		// 	// );
		// 	req.user = {
		// 		...req.user,
		// 		mmIdx: memberSelectOne.mmIdx,
		// 		deviceUuid: deviceUuid,
		// 	};
		// 	res.header({
		// 		user: {
		// 			accessToken: accessToken,
		// 			refreshToken: refreshToken,
		// 		},
		// 	});
		// 	const result = {
		// 		duplicate: 0,
		// 		name: memberSelectOne.name,
		// 		accessToken: accessToken,
		// 		refreshToken: refreshToken,
		// 		mmIdx: memberSelectOne.mmIdx,
		// 		uid: memberSelectOne.uid,
		// 		loginType: memberSelectOne.loginType,
		// 		stateCode: memberSelectOne.stateCode,
		// 		email: memberSelectOne.email,
		// 		nick: memberSelectOne.nick,
		// 		profileImageUrl: memberSelectOne.profileImageUrl,
		// 		// silverboxCnt: memberSelectOne.silverboxCnt,
		// 		goldboxCnt: memberSelectOne.goldboxCnt,
		// 		freePoint: memberSelectOne.freePoint,
		// 	};
		// const _json = encode(JSON.stringify(result));
		// console.log(_json,'JSON SELECT')
		// return res.render('postMessage', { result: _json });
		// }
	}
	// async memberLoginHistoryInsert(data: any): Promise<any> {
	// 	const { req, res, ip } = data;
	// 	const user = req.user;
	// 	console.log(user, 'USER@#');
	// 	let deviceUuid = req.headers.cookie?.split(';').filter((e) => e.trim().startsWith('deviceUuid='));
	// 	deviceUuid = deviceUuid && deviceUuid.length > 0 && deviceUuid[0].replace('deviceUuid=', '');
	// 	const memberSelectOne = await this.memberRepository.findOne({
	// 		where: {
	// 			// stateCode: MoreThan(0),
	// 			joinChannelCode: user.joinChannelCode,
	// 			uid: user.uid,
	// 		},
	// 	});
	// 	const accessToken = this.jwt.sign(user, {
	// 		expiresIn: baseConfig.jwt.expiresIn.accessToken,
	// 	});
	// 	const refreshToken = this.jwt.sign(
	// 		{
	// 			user,
	// 			expiredDt: getExpireTime(baseConfig.jwt.expiresIn.refreshToken),
	// 		},
	// 		{ expiresIn: baseConfig.jwt.expiresIn.refreshToken }
	// 	);
	// 	await insertQuery(this.memberLoginHistoryRepository, {
	// 		mmIdx: memberSelectOne.mmIdx,
	// 		loginIp: ip,
	// 		loginDt: getNow(),
	// 		type:
	// 			// 	memberLoginHistorySelectOne?.deviceUuid === data.deviceUuid
	// 			// 		? "reLogin"
	// 			// 		:
	// 			'reLogin',
	// 		loginType: memberSelectOne.loginType,
	// 		accessToken: accessToken,
	// 		refreshToken: refreshToken,
	// 		deviceUuid: data.deviceUuid,
	// 	});
	// 	// res.cookie(
	// 	// 	"Authorization",
	// 	// 	{
	// 	// 		accessToken: accessToken,
	// 	// 		refreshToken: refreshToken,
	// 	// 	},
	// 	// 	{
	// 	// 		httpOnly: true,
	// 	// 		path: "/",
	// 	// 		maxAge: baseConfig.cookieAge, //1 day
	// 	// 	}
	// 	// );

	// 	req.user = {
	// 		...req.user,
	// 		mmIdx: memberSelectOne.mmIdx,
	// 		deviceUuid: deviceUuid,
	// 	};
	// 	res.header({
	// 		user: {
	// 			accessToken: accessToken,
	// 			refreshToken: refreshToken,
	// 		},
	// 	});
	// 	const result = {
	// 		accessToken: accessToken,
	// 		refreshToken: refreshToken,
	// 		mmIdx: memberSelectOne.mmIdx,
	// 		uid: memberSelectOne.uid,
	// 		loginType: memberSelectOne.loginType,
	// 		stateCode: memberSelectOne.stateCode,
	// 		email: memberSelectOne.email,
	// 		nick: memberSelectOne.nick,
	// 		profileImageUrl: memberSelectOne.profileImageUrl,
	// 		goldboxCnt: memberSelectOne.goldboxCnt,
	// 		freePoint: memberSelectOne.freePoint,
	// 	};

	// 	const _json = encode(JSON.stringify(result));
	// 	return res.render('postMessage', { result: _json });
	// }
	// async logOut(data: any): Promise<any> {
	// 	// console.log(data.res, "DATA!!!!");
	// 	let result = [];
	// 	const { req, res, ip } = data;
	// 	// console.log(req.headers, "header@!#!@#@!@!#@!@!@#!");
	// 	const token = await this.memberLoginHistoryRepository.find({
	// 		where: { mmIdx: req.user.mmIdx, type: In(['new', 'reLogin']) },
	// 		order: { loginDt: 'DESC' },
	// 		take: 1,
	// 	});
	// 	console.log(token, 'TOKEN');
	// 	result.push(
	// 		await insertQuery(this.memberLoginHistoryRepository, {
	// 			mmIdx: req.user.mmIdx,
	// 			loginIp: ip,
	// 			loginDt: getNow(),
	// 			type: 'logout',
	// 			loginType: req.user.loginType,
	// 			accessToken: token[0].accessToken,
	// 			refreshToken: token[0].refreshToken,
	// 			// accessToken: JSON.parse(req.headers.authorization).accessToken,
	// 			// refreshToken: JSON.parse(req.headers.authorization)
	// 			// 	.refreshToken,
	// 			// deviceUuid: data.deviceUuid,
	// 		})
	// 	);
	// 	res.cookie('Authorization', null);
	// 	// console.log(res, "RES!@#!@");
	// 	// res["user"] = null;
	// 	// res["authorization"] = null;
	// 	if (req['user']) {
	// 		req['user'] = null;
	// 	}
	// 	req.headers.Authorization = null;
	// 	return res.json({ result });
	// }
	// async withDrawMember(data: any): Promise<any> {
	// 	const { req, res, ip, reason } = data;
	// 	const memberInfo = await this.memberRepository.findOne({
	// 		where: { mmIdx: req.user.mmIdx },
	// 	});
	// 	if (!memberInfo) {
	// 		throw new BadRequestException('회원정보가 없습니다.', '-301');
	// 	}
	// 	if (memberInfo.loginTypeCode == 4) {
	// 		const tokenData = await this.memberLoginHistoryRepository.findOne({
	// 			where: { mmIdx: req.user.mmIdx },
	// 			order: { mlhIdx: 'desc' },
	// 		});
	// 		const appleUnlink = await this.unlinkApple(this.jwt.decode(tokenData.accessToken)?.refreshToken);

	// 		// const appleUnlink = await this.unlinkApple(
	// 		// 	this.jwt.decode(tokenData.accessToken)?.code
	// 		// );
	// 		if (appleUnlink.code != 200) {
	// 			throw new BadRequestException('로그인 연동해제 실패', '-300');
	// 		}
	// 	}
	// 	const withDraw = await updateQuery(
	// 		this.memberRepository,
	// 		{
	// 			stateCode: '-999',
	// 			leaveDt: getNow(),
	// 			leaveIp: ip,
	// 			leaveReason: reason,
	// 		},
	// 		{ mmIdx: req.user.mmIdx }
	// 	);
	// 	if (withDraw.raw.affectedRows == 0) {
	// 		throw new BadRequestException('탈퇴에 실패했습니다.', '-201');
	// 	}
	// 	return this.logOut(data);

	// 	//
	// }

	// 로그 확인
	// async unlinkApple(code: any): Promise<any> {
	// 	console.log('Apple', code);
	// 	// 1. 클라이언트 시크릿 키 생성
	// 	const clientSecret = await this.appleClientSecret();
	// 	let result = { code: 200, message: '애플연동해제' };
	// 	// console.log(clientSecret, "------secret");
	// 	console.log(code, '------code');
	// 	// const data = {
	// 	// 	code: code,
	// 	// 	client_id: baseConfig.socialLogin.apple.clientId,
	// 	// 	client_secret: clientSecret,
	// 	// 	grant_type: "authorization_code",
	// 	// };
	// 	// let accessToken: string;
	// 	// await axios({
	// 	// 	method: "POST",
	// 	// 	url: `https://appleid.apple.com/auth/token`,
	// 	// 	params: data,
	// 	// 	headers: {
	// 	// 		"Content-type": "application/x-www-form-urlencoded",
	// 	// 	},
	// 	// })
	// 	// 	.then((e) => {
	// 	// 		accessToken = e.data.access_token;
	// 	// 		console.log(e.data, "E>>>>>>>");
	// 	// 	})
	// 	// 	.catch((error) => {
	// 	// 		console.log(error.response.data, "ERROR!!!!!");
	// 	// 	});
	// 	// if (!accessToken) {
	// 	// 	throw new BadRequestException("토큰 생성 에러", "-400");
	// 	// }
	// 	const datas = {
	// 		client_id: baseConfig.socialLogin.apple.clientId,
	// 		client_secret: clientSecret,
	// 		// token: accessToken,
	// 		token: code,
	// 		// token_type_hint: "access_token", // 'refresh_token'
	// 		token_type_hint: 'refresh_token', // 'refresh_token'
	// 	};
	// 	await axios({
	// 		method: 'POST',

	// 		url: `https://appleid.apple.com/auth/revoke`,
	// 		params: datas,

	// 		headers: {
	// 			'Content-type': 'application/x-www-form-urlencoded',
	// 		},
	// 	})
	// 		.then((e) => {
	// 			console.log(e.data, 'revoke REsult');
	// 		})
	// 		.catch((error) => {
	// 			console.log(error.response.data, 'ERROR!!!!!');
	// 			result = error.response.data;
	// 		});
	// 	// console.log(result.data, "RESULT!@#!@#");

	// 	return result;
	// }

	// async appleClientSecret(): Promise<any> {
	// 	const privateKey = baseConfig.socialLogin.apple.authKey;
	// 	console.log(privateKey, '@>?@@>');

	// 	// const clientSecret = this.jwt.sign(header,privateKey);
	// 	const clientSecret = jwt.sign(
	// 		{
	// 			// payload: {
	// 			iss: baseConfig.socialLogin.apple.teamId,
	// 			iat: Math.floor(Date.now() / 1000),
	// 			// exp: Math.floor(Date.now() / 1000) + 86400 * 180,
	// 			exp: Math.floor(Date.now() / 1000) + 120,
	// 			aud: 'https://appleid.apple.com',
	// 			sub: baseConfig.socialLogin.apple.clientId,
	// 			// },
	// 		},
	// 		privateKey,
	// 		{
	// 			// algorithm: "ES256",
	// 			// keyid: baseConfig.socialLogin.apple.keyId,
	// 			header: {
	// 				alg: 'ES256',
	// 				kid: baseConfig.socialLogin.apple.keyId,
	// 				typ: 'JWT',
	// 			},
	// 		}
	// 	);

	// 	console.log(clientSecret, 'AAAA');
	// 	return clientSecret;
	// 	// return clientSecret;
	// }
}

