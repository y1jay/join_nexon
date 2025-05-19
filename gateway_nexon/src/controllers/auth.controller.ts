import { Body, Controller, Get, Inject, Patch, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { joinUserDto } from 'src/dto/joinUserDto';
import { IsNotEmptyPipe, RequiredValidationPipe } from 'src/pipe/custom.pipe';

@Controller('auth')
export class AuthController {
	constructor(
		@Inject('AUTH_SERVICE')
		private readonly AuthProxy: ClientProxy,
		private readonly AuthService: AuthService
	) {}

	// 사용자 가입
	@Post('join')
	async join_user(
		@Body('joinUser', RequiredValidationPipe, IsNotEmptyPipe) join_user_dto: joinUserDto,
		@Res() res: Response
	): Promise<any> {
		const auth = await this.AuthProxy.send({ cmd: 'joinUser' }, { join_user_dto: join_user_dto }).toPromise();
		return this.AuthService.logIn(auth, res);
	}
	// 사용자 로그인
	@Patch('login')
	async login_user(
		@Body('loginUser', RequiredValidationPipe, IsNotEmptyPipe) login_user: { user_id: string; password: string },
		@Res() res: Response
	): Promise<any> {
		const auth = await this.AuthProxy.send({ cmd: 'loginUser' }, login_user).toPromise();
		return this.AuthService.logIn(auth, res);
	}
	// 사용자 조회
	@Get('find')
	find_user(): Observable<any> {
		return this.AuthProxy.send({ cmd: 'findUser' }, '');
	}
	// 등급 부여
	@Patch('grade')
	grade_user(
		@Body('grade_user', RequiredValidationPipe, IsNotEmptyPipe) grade_user: { _id: string; grade: string }
	): Observable<any> {
		return this.AuthProxy.send({ cmd: 'gradeUser' }, grade_user);
	}
}

