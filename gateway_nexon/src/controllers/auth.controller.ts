import { Body, Controller, Get, Inject, Patch, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { joinUserDto } from 'src/dto/joinUserDto';

@Controller('auth')
export class AuthController {
	constructor(
		@Inject('AUTH_SERVICE')
		private readonly AuthProxy: ClientProxy
	) {}

	@Post('join')
	join_user(@Body('joinUser') join_user_dto: joinUserDto): Observable<any> {
		return this.AuthProxy.send({ cmd: 'joinUser' }, { join_user_dto: join_user_dto });
	}
	@Get('find')
	find_user(): Observable<any> {
		return this.AuthProxy.send({ cmd: 'findUser' }, '');
	}
	@Patch('login')
	login_user(@Query('name') name: string): Observable<any> {
		return this.AuthProxy.send({ cmd: 'hello' }, name);
	}
}

