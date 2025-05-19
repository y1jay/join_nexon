import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
	constructor(private readonly jwt: JwtService) {}

	async logIn(data: any, res: any): Promise<any> {
		const authInfo = await data;
		console.log(authInfo, 'AUTH');
		if (authInfo.statusCode == 200) {
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
		}
		return res.send({ ...authInfo });
	}
}

