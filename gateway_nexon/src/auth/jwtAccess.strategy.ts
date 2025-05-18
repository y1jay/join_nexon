import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
// import { AuthService } from "src/services/auth.service";

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
	constructor() {
		super({
			ignoreExpiration: false,
			secretOrKey: process.env.JWT_SECRET,
			// 토큰
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request) => {
					// console.log(request, 'JSON REQUEST');
					let token: string;
					if (typeof request.headers.authorization == 'object') {
						token = request.headers.authorization.access_token;
					} else if (typeof request.headers.authorization == 'string') {
						token = JSON.parse(request?.headers?.authorization).access_token;
					} else {
						token = request?.cookies?.Authorization.access_token;
					}
					console.log(token, 'STRATEGY TOKEN!!!');
					return token;
					// return request?.cookies?.Authorization;
				},
			]),
		});
	}

	async validate(payload: any, context: ExecutionContext) {
		console.log(context, 'STRATEGY PAYLOAD');
		// console.log(request, 'RESUETESR#$@#');

		return payload;
	}
}
