import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { joinUserDto } from 'src/dto/joinUserDto';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	// 회원 가입 호출
	@MessagePattern({ cmd: 'joinUser' })
	joinUserPoint(join_user_dto: joinUserDto): Promise<User> {
		console.log(join_user_dto, 'REQ#$@$');
		return this.authService.join_user_service(join_user_dto);
	}
	// 회원 조회 호출
	@MessagePattern({ cmd: 'findUser' })
	findUserPoint(): Promise<User[]> {
		console.log('USER JSON');
		return this.authService.find_user_service();
	}
}

