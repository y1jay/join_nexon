import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { joinUserDto } from 'src/dto/joinUserDto';
import { AuthService } from './auth.service';
import { Result } from './dto/result';
import { User } from './schemas/user.schema';

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	// 회원 가입 호출
	@MessagePattern({ cmd: 'joinUser' })
	joinUserPoint(
		join_user_dto: joinUserDto
	): Promise<Result<{ user?: User; access_token?: string; refresh_token?: string }>> {
		return this.authService.join_user_service(join_user_dto);
	}
	// 로그인 호출
	@MessagePattern({ cmd: 'loginUser' })
	loginUserPoint(login_user_dto: {
		user_id: string;
		password: string;
	}): Promise<Result<{ user?: User; access_token?: string; refresh_token?: string }>> {
		return this.authService.login_user_service(login_user_dto);
	}
	// 회원 조회 호출
	@MessagePattern({ cmd: 'findUser' })
	findUserPoint(org: { page: number; limit: number; sort: string }): Promise<User[]> {
		return this.authService.find_user_service();
	}
	// 등급 부여 호출
	@MessagePattern({ cmd: 'gradeUser' })
	provideGradePoint(grade_user_dto: { _id: string; grade: string }): Promise<Result<any>> {
		return this.authService.provide_user_grade(grade_user_dto);
	}
}

