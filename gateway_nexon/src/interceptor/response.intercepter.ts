import {
	Injectable,
	NestInterceptor,
	ExecutionContext,
	CallHandler,
	HttpException,
	BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import { getNow, hasProperty } from "src/common/util";
// import { baseConfig } from "src/config/base.config";
// import { MemberService } from "src/services/member.service";

export interface Response<T> {
	data: T;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
	constructor(private jwtService: JwtService) {}

	async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
		const request = context.switchToHttp().getRequest();
		// 결과값 핸들러
		return next.handle().pipe(
			map(async (data: any) => {
				try {
					if (!data.statusCode) {
						return {
							statusCode: 200,
							message: 'success',
							data: data ?? [],
						};
					} else {
						return data;
					}
				} catch (e) {
					throw e;
				}
			})
		);
	}
}
