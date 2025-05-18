import { Body, Controller, Get, Inject, Patch, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { joinUserDto } from 'src/dto/joinUserDto';

@Controller('auth')
export class AuthController {
	constructor(
		@Inject('AUTH_SERVICE')
		private readonly AuthProxy: ClientProxy,
		private readonly AuthService: AuthService
	) {}

	// 사용자 가입
	@Post('join')
	join_user(@Body('joinUser') join_user_dto: joinUserDto): Observable<any> {
		return this.AuthProxy.send({ cmd: 'joinUser' }, { join_user_dto: join_user_dto });
	}
	@Get('find')
	find_user(@Req() req: Request): Observable<any> {
		// console.log(req['user'], 'USER@#!@');
		return this.AuthProxy.send({ cmd: 'findUser' }, '');
	}
	// 사용자 로그인
	@Patch('login')
	async login_user(
		@Body('loginUser') login_user: { user_id: string; password: string },
		@Res() res: Response
	): Promise<any> {
		const auth = this.AuthProxy.send({ cmd: 'loginUser' }, login_user).toPromise();
		return this.AuthService.logIn(auth, res);
	}
}
