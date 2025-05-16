import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { joinUserDto } from './dto/joinUserDto';
import { resultDto } from './dto/resultDto';
import { User, UserDocument } from './schemas/user.schema';
import * as util from './common/util';
import { JwtService } from '@nestjs/jwt';
import { Login, LoginDocument } from './schemas/login.schema';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name)
		private user: Model<UserDocument>,

		@InjectModel(Login.name)
		private login: Model<LoginDocument>,

		private readonly jwt: JwtService
	) {}
	async join_user_service(org: joinUserDto): Promise<any> {
		// 이메일 정보 조회
		console.log(org['join_user_dto'].email, 'EMAI:#@#');
		const findEmail = await this.user.findOne({ email: org['join_user_dto'].email }).exec();
		// 닉네임 중복
		// 비밀번호 암호화
		console.log(findEmail, 'EMAIL:<@#$');
		// 탈퇴 후 6개월
		if (findEmail) {
			throw new BadRequestException('이미 가입 한 회원입니다.');
		} else if (findEmail?.state_code == -999 && util.dayDiff(findEmail?.leave_date) < 6) {
			throw new BadRequestException('탈퇴 후 6개월 뒤 가입 가능 합니다.');
		}
		// 유저 생성
		const create_user = await new this.user({
			...org['join_user_dto'],
			state_code: 200,
			join_date: util.getNow(),
		}).save();
		console.log(create_user, 'USER@#$@#');
		if (!create_user) {
			throw new BadRequestException('회원 생성에 실패했습니다.');
		}
		console.log('IN1');
		const payload = {
			_id: create_user._id,
			user_id: create_user.user_id,
			name: create_user.name,
			nick: create_user.nick,
			state_code: create_user.state_code.toString(),
			phone_number: create_user.phone_number,
			email: create_user.email,
			social_type: create_user.social_type,
			join_date: create_user.join_date,
		};

		console.log('IN2');
		// 토큰 생성
		const access_token = this.jwt.sign(payload, {
			expiresIn: process.env.JWT_ACCESS_EXPIRES,
		});
		const refresh_token = this.jwt.sign(payload, {
			expiresIn: process.env.JWT_REFRESH_EXPIRES,
		});
		// 가입 이력 생성
		const login_history = await new this.login({
			user_id: create_user.user_id,
			regist_date: create_user.join_date,
			access_token: access_token,
			refresh_token: refresh_token,
		}).save();
		console.log('IN3');

		if (!login_history) {
			throw new BadRequestException('회원 가입에 실패했습니다.');
		}

		return {
			user: create_user,
			access_token: access_token,
			refresh_token: refresh_token,
		};
	}
	async find_user_service(): Promise<any> {
		return this.user.find().exec();
	}
	async login_user_service(): Promise<any> {
		return;
	}
}

