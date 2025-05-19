import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { AuthGuard } from '@nestjs/passport';
@Injectable()
export class jwtAuthGuard extends AuthGuard(['access', 'refresh']) {
	canActivate(context: ExecutionContext) {
		if (['login_user', 'join_user'].includes(context.getHandler().name)) {
			return true;
		}

		return super.canActivate(context);
		// return true;
	}

	handleRequest(err, user) {
		if (err || !user) {
			throw err || new UnauthorizedException();
		}
		return user;
	}
}

