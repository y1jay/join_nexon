import { Controller, Get, Inject, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs'

@Controller()
export class AppController {
	constructor(
		@Inject("AUTH_SERVICE")
		private readonly proxy: ClientProxy,
	) { }

	@Get("hello")
	getHello(@Query('name') name: string): Observable<string> {
		return this.proxy.send({ cmd: 'hello' }, name)
	}
}
