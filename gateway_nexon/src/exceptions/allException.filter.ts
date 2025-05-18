import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	catch(exception: HttpException, host: ArgumentsHost): void {
		console.log(exception, 'EXCEOPTION');
		const { httpAdapter } = this.httpAdapterHost;
		const ctx = host.switchToHttp();
		const responseBody = {
			statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
			message: '알 수 없는 서버에러',
		};
		console.log(ctx.getNext(), 'EFESFE');

		if (exception instanceof HttpException) {
			// responseBody.statusCode = exception.getStatus();
			// responseBody.message = exception.message;
			Object.assign(responseBody, exception.getResponse());
		}

		httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
	}
}
