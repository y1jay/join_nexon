import { Controller, Get, Inject } from '@nestjs/common';

@Controller()
export class AppController {
	constructor() {}

	@Get('hello')
	getHello(): any {
		return 'hello';
	}
}

