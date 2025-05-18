import { BadRequestException, Injectable, UnauthorizedException, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import { Observable } from 'rxjs';
@Injectable()
export class AuthService {
	constructor(private readonly jwt: JwtService) {}

	async logIn(data: any, res: any): Promise<any> {
		const authInfo = await data;

		res.cookie(
			'Authorization',
			{
				access_token: authInfo.data.access_token,
				refresh_token: authInfo.data.refresh_token,
			},
			{
				httpOnly: true,
				path: '/',
				maxAge: process.env.cookieAge, //1 day
			}
		);
		return res.send({ authInfo });
	}
}
