import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class joinUserDto {
	@IsNotEmpty()
	@IsString()
	@Length(5, 10)
	user_id: string;

	@IsNotEmpty()
	@IsString()
	@Length(10, 20)
	password: string;

	@IsNotEmpty()
	@IsString()
	name: string;

	@IsNotEmpty()
	@IsString()
	nick: string;

	@IsNotEmpty()
	@IsString()
	phone_number: string;

	@IsNotEmpty()
	@IsString()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	social_type: string;
}

