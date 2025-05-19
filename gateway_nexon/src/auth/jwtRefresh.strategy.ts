import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
	constructor() {
		super({
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
			// 토큰
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request) => {
					let token: string;
					if (typeof request.headers.authorization == 'object') {
						token = request.headers.authorization.refresh_token;
					} else if (typeof request.headers.authorization == 'string') {
						token = JSON.parse(request?.headers?.authorization).refresh_token;
					} else {
						token = request?.cookies?.Authorization.refresh_token;
					}
					return token;
				},
			]),
		});
	}

	async validate(payload: any) {
		return payload;
	}
}
