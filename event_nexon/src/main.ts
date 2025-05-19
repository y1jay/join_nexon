import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { EventModule } from './event.module';
import { ConfigService } from './config/config.service';
import { Logger } from '@nestjs/common';

const bootstrap = async () => {
	const config = new ConfigService();
	const options = config.get('service');
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(EventModule, options);
	await app.listen();

	Logger.log(`🚀 Event Server : TCP ${JSON.stringify(options)}`, 'bootstrap-event');
};
bootstrap();

