import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { AuthGuard } from '@nestjs/passport';
@Injectable()
// export class jwtAuthGuard implements CanActivate {
// 	constructor(private jwtService: JwtService, private reflector: Reflector) {}

// 	async canActivate(context: ExecutionContext): Promise<boolean> {
export class jwtAuthGuard extends AuthGuard(['access', 'refresh']) {
	canActivate(context: ExecutionContext) {
		if (['login_user'].includes(context.getHandler().name)) {
			return true;
		}
		if (['appleAuth', 'googleAuth'].includes(context.getHandler().name)) {
			return true;
		}

		// if (
		// 	[BoardController].filter((value) => value === context.getClass())
		// 		.length > 0
		// ) {
		// 	if (
		// 		context.getClass().name === "BoardController" &&
		// 		["eventView", "eventList", "noticeList", "noticeView"].includes(
		// 			context.getHandler().name
		// 		)
		// 	) {
		// 		return true;
		// 	}
		// }

		// if (
		// 	(context.getClass().name === "NewsfeedController" &&
		// 		["list", "replyList"].includes(context.getHandler().name)) ||
		// 	(context.getClass().name === "PresentController" &&
		// 		["selectAll", "selectOne"].includes(context.getHandler().name))
		// ) {
		// 	return true;
		// }

		return super.canActivate(context);
		// return true;
	}

	handleRequest(err, user) {
		// console.log(err, "!");
		console.log(user, '!');
		if (err || !user) {
			throw err || new UnauthorizedException();
		}
		return user;
	}
}
