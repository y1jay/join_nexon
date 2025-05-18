import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import mongoose from 'mongoose';
import { joinUserDto } from './dto/joinUserDto';
import { User, UserDocument } from './schemas/user.schema';
import * as util from './common/util';
import { JwtService } from '@nestjs/jwt';
import { Login, LoginDocument } from './schemas/login.schema';
import * as bcrypt from 'bcryptjs';
import { Result } from './dto/result';

@Injectable()
export class AuthService {
	constructor(
		// 유저 스키마 주입
		@InjectModel(User.name)
		private user: Model<UserDocument>,

		// 로그인 이력 스키마 주입
		@InjectModel(Login.name)
		private login: Model<LoginDocument>,

		// jwt 서비스 생성자
		private readonly jwt: JwtService,

		@InjectConnection()
		private readonly conn: mongoose.Connection
	) {}
	async join_user_service(
		org: joinUserDto
	): Promise<Result<{ user?: User; access_token?: string; refresh_token?: string }>> {
		// 세션을 시작하고 세션 객체를 저장한다.
		const session = await this.conn.startSession();
		// 세션에서 트랜잭션을 시작한다.
		session.startTransaction();
		try {
			// 이메일 정보 조회
			const find_email = await this.user.findOne({ email: org['join_user_dto'].email }).exec();

			// 비밀번호 암호화
			// 탈퇴 후 6개월
			if (find_email) {
				return { statusCode: 400, message: '이미 가입 한 회원입니다.' };
			} else if (find_email?.state_code == -999 && util.dayDiff(find_email?.leave_date) < 6) {
				return { statusCode: 400, message: '탈퇴한 회원입니다.' };
			}
			// 닉네임 중복
			const find_nick = await this.user.findOne({ nick: org['join_user_dto'].nick }).exec();
			if (find_nick) {
				return { statusCode: 400, message: '닉네임 중복' };
			}
			// 비밀번호 암호화
			org['join_user_dto'].password = (await bcrypt.hash(org['join_user_dto'].password, 10)).toString();

			if (!util.getGrade(org['join_user_dto'].login_type)) {
				return { statusCode: 400, message: '가입 타입이 잘못됐습니다.' };
			}
			// 유저 생성
			const create_user = await new this.user({
				...org['join_user_dto'],
				state_code: 200,
				join_date: util.getNow(),
			}).save({ session });
			console.log(create_user, 'USER@#$@#');
			if (!create_user) {
				return { statusCode: 401, message: '회원 가입 실패.' };
			}

			// 토큰 페이로드
			const payload: Object = {
				_id: create_user._id,
				user_id: create_user.user_id,
				name: create_user.name,
				nick: create_user.nick,
				state_code: create_user.state_code.toString(),
				phone_number: create_user.phone_number,
				email: create_user.email,
				login_type: create_user.login_type,
				join_date: create_user.join_date,
			};

			// 토큰 생성
			const access_token: string = this.jwt.sign(payload, {
				expiresIn: process.env.JWT_ACCESS_EXPIRES,
			});
			const refresh_token: string = this.jwt.sign(payload, {
				expiresIn: process.env.JWT_REFRESH_EXPIRES,
			});
			// 가입 이력 생성
			const login_history = await new this.login({
				user_id: create_user.user_id,
				regist_date: create_user.join_date,
				access_token: access_token,
				refresh_token: refresh_token,
			}).save({ session });

			if (!login_history) {
				return { statusCode: 402, message: '회원 가입 실패.' };
			}
			// 커밋
			await session.commitTransaction();
			return {
				statusCode: 200,
				message: 'success',
				data: { user: create_user, access_token: access_token, refresh_token: refresh_token },
			};
		} catch (e) {
			// 트랜잭션 취소
			await session.abortTransaction();
			return { statusCode: 500, message: '회원가입 실패.' };
		} finally {
			// 종료
			session.endSession();
		}
	}
	async find_user_service(): Promise<any> {
		return this.user.find().exec();
	}
	// 로그인

	async login_user_service(org: {
		user_id: string;
		password: string;
	}): Promise<Result<{ user?: User; access_token?: string; refresh_token?: string }>> {
		const login_user = await this.user.findOne({ user_id: org.user_id }).exec();
		if (login_user && !(await bcrypt.compare(org.password, login_user.password))) {
			return { statusCode: 401, message: '비밀번호 오류.' };
		}
		// 토큰 페이로드
		const payload: Object = {
			_id: login_user._id,
			user_id: login_user.user_id,
			name: login_user.name,
			nick: login_user.nick,
			state_code: login_user.state_code.toString(),
			phone_number: login_user.phone_number,
			email: login_user.email,
			login_type: login_user.login_type,
			join_date: util.getNow(),
		};

		// 토큰 생성
		const access_token: string = this.jwt.sign(payload, {
			expiresIn: process.env.JWT_ACCESS_EXPIRES,
		});
		const refresh_token: string = this.jwt.sign(payload, {
			expiresIn: process.env.JWT_REFRESH_EXPIRES,
		});
		// 가입 이력 생성
		const login_history = await new this.login({
			user_id: login_user.user_id,
			regist_date: util.getNow(),
			access_token: access_token,
			refresh_token: refresh_token,
		}).save();

		if (!login_history) {
			return { statusCode: 402, message: '로그인 실패.' };
		}
		return {
			statusCode: 200,
			message: 'success',
			data: { user: login_user, access_token: access_token, refresh_token: refresh_token },
		};
	}
}
