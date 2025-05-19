import { Body, Controller, Get, Inject, Patch, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('event')
export class EventController {
	constructor(
		@Inject('EVENT_SERVICE')
		private readonly EventProxy: ClientProxy,
		private readonly AuthService: AuthService
	) {}

	// // 사용자 가입
	// @Post('join')
	// async join_user(@Body('joinUser') join_user_dto: joinUserDto, @Res() res: Response): Promise<any> {
	// 	const auth = this.AuthProxy.send({ cmd: 'joinUser' }, { join_user_dto: join_user_dto }).toPromise();
	// 	return this.AuthService.logIn(auth, res);
	// }
	// // 사용자 로그인
	// @Patch('login')
	// async login_user(
	// 	@Body('loginUser') login_user: { user_id: string; password: string },
	// 	@Res() res: Response
	// ): Promise<any> {
	// 	const auth = this.AuthProxy.send({ cmd: 'loginUser' }, login_user).toPromise();
	// 	return this.AuthService.logIn(auth, res);
	// }
	// @Get('find')
	// user_find_user(): Observable<any> {
	// 	return this.AuthProxy.send({ cmd: 'findUser' }, '');
	// }
}

