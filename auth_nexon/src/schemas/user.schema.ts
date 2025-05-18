import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

// 유저 스키마
@Schema({ collection: 'users' })
export class User {
	// 유저아이디
	@Prop({ required: true })
	user_id: string;

	// 유저 비밀번호
	@Prop({ required: true })
	password: string;

	// 유저 이름
	@Prop({ required: true })
	name: string;

	// 유저 닉네임
	@Prop({ required: true })
	nick: string;

	// 유저 상태 코드
	@Prop({ required: true })
	state_code: number;

	// 유저 전화번호
	@Prop({ required: true })
	phone_number: string;

	// 유저 이메일
	@Prop({ required: true })
	email: string;

	// 유저 로그인 타입
	@Prop({ required: true })
	login_type: string;

	// 유저 가입일시
	@Prop({ required: true })
	join_date: Date;

	// 유저 탈퇴일시
	@Prop({ default: 0 })
	leave_date: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
