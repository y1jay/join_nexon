import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	catch(exception: HttpException, host: ArgumentsHost): void {
		const { httpAdapter } = this.httpAdapterHost;
		console.log(exception, 'EC');
		const ctx = host.switchToHttp();
		let responseBody = {
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: '알 수 없는 서버에러',
		};

		if (exception instanceof HttpException) {
			// responseBody.statusCode = exception.getStatus();
			// responseBody.message = exception.message;

			Object.assign(responseBody, exception.getResponse());
		}
		if (exception?.getStatus() == 403) {
			responseBody = {
				statusCode: HttpStatus.FORBIDDEN,
				message: '권한 없음',
			};
		}

		httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
	}
}
