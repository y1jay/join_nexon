import { Body, Controller, Get, Inject, Patch, Post, Query, Req, Res } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { User } from 'src/dto/userDto';
import { IsNotEmptyPipe, RequiredValidationPipe } from 'src/pipe/custom.pipe';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
// @ApiTags('유저 관리')
export class AuthController {
	constructor(
		@Inject('AUTH_SERVICE')
		private readonly AuthProxy: ClientProxy,
		private readonly AuthService: AuthService
	) {}

	// 사용자 가입
	@Post('join')
	@ApiOperation({ summary: '사용자 가입' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				joinUser: {
					type: 'object',
					properties: {
						name: { example: '이름' },
						nick: { example: '닉네임' },
						phone_number: { example: '핸드폰번호' },
						email: { example: '이메일' },
						password: { example: '비밀번호' },
						user_id: { example: '아이디' },
					},
				},
			},
		},
	})
	@ApiResponse({
		schema: {
			type: 'object',
			properties: {
				statusCode: { example: '상태코드 (200:성공 400:가입 불가능한 정보,401:가입 실패)' },
				message: { example: '메세지' },
				data: {
					properties: {
						user: {
							properties: {
								user_id: { example: '아이디' },
								password: { example: '비밀번호 (암호화)' },
								name: { example: '이름' },
								nick: { example: '닉네임' },
								state_code: { example: '회원상태' },
								phone_number: { example: '전화번호' },
								email: { example: '이메일' },
								login_type: { example: '로그인타입' },
								join_date: { example: '가입일시' },
								leave_date: { example: '탈퇴일시' },
								_id: { example: '회원 고유번호' },
							},
						},
					},
				},
			},
		},
	})
	async join_user(
		@Body('joinUser', RequiredValidationPipe, IsNotEmptyPipe) join_user_dto: User,
		@Res() res: Response
	): Promise<any> {
		const auth = await this.AuthProxy.send({ cmd: 'joinUser' }, { join_user_dto: join_user_dto }).toPromise();
		return this.AuthService.logIn(auth, res);
	}
	// 사용자 로그인
	@Patch('login')
	@ApiOperation({ summary: '사용자 로그인' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				loginUser: {
					type: 'object',
					properties: {
						password: { example: '비밀번호' },
						user_id: { example: '아이디' },
					},
				},
			},
		},
	})
	@ApiResponse({
		schema: {
			type: 'object',
			properties: {
				statusCode: { example: '상태코드 (200:성공 400:로그인 불가능한 정보,401:로그인 실패)' },
				message: { example: '메세지' },
				data: {
					properties: {
						user: {
							properties: {
								user_id: { example: '아이디' },
								password: { example: '비밀번호 (암호화)' },
								name: { example: '이름' },
								nick: { example: '닉네임' },
								state_code: { example: '회원상태' },
								phone_number: { example: '전화번호' },
								email: { example: '이메일' },
								login_type: { example: '로그인타입' },
								join_date: { example: '가입일시' },
								leave_date: { example: '탈퇴일시' },
								_id: { example: '회원 고유번호' },
							},
						},
						access_token: { example: '엑세스 토큰' },
						refresh_token: { example: '리프레시 토큰' },
					},
				},
			},
		},
	})
	async login_user(
		@Body('loginUser', RequiredValidationPipe, IsNotEmptyPipe) login_user: { user_id: string; password: string },
		@Res() res: Response
	): Promise<any> {
		const auth = await this.AuthProxy.send({ cmd: 'loginUser' }, login_user).toPromise();
		return this.AuthService.logIn(auth, res);
	}
	// 사용자 조회
	@Get('find')
	@ApiOperation({ summary: '테스트용 사용X' })
	find_user(): Observable<any> {
		return this.AuthProxy.send({ cmd: 'findUser' }, '');
	}
	// 등급 부여
	@Patch('grade')
	@ApiOperation({ summary: '등급 부여' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				loginUser: {
					type: 'object',
					properties: {
						_id: { example: '등급 부여 할 회원 고유번호' },
						grade: { example: '등급 (user,operator,auditor,admin)' },
					},
				},
			},
		},
	})
	@ApiResponse({
		schema: {
			type: 'object',
			properties: {
				statusCode: { example: '상태코드 (200:성공 400:로그인 불가능한 정보,401:로그인 실패)' },
				message: { example: '메세지' },
			},
		},
	})
	grade_user(
		@Body('grade_user', RequiredValidationPipe, IsNotEmptyPipe) grade_user: { _id: string; grade: string }
	): Observable<any> {
		return this.AuthProxy.send({ cmd: 'gradeUser' }, grade_user);
	}
}
