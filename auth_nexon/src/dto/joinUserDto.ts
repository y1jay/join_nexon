import { IsEmail, IsNotEmpty, IsString, Length, IsInt } from 'class-validator';

export class joinUserDto {
	// 회원 아이디
	@IsNotEmpty()
	@IsString()
	@Length(5, 10)
	user_id: string;

	// 회원 명
	@IsNotEmpty()
	@IsString()
	name: string;

	// 회원 닉네임
	@IsNotEmpty()
	@IsString()
	nick: string;

	// 회원 전화번호
	@IsNotEmpty()
	@IsString()
	phone_number: string;

	// 회원 이메일
	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;

	// 비밀번호
	@IsNotEmpty()
	@IsString()
	password: string;

	// 내부 확인
	login_type?: string;
	state_code?: number;
	join_date?: Date;
	access_token?: string;
	refresh_token?: string;
}

