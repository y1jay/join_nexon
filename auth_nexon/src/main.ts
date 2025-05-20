import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './auth.module';
import { ConfigService } from './config/config.service';
import { Logger } from '@nestjs/common';

const bootstrap = async () => {
	const config = new ConfigService();
	const options = config.get('service');
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, options);
	await app.listen();

	Logger.log(`🚀 Auth Server: TCP ${JSON.stringify(options)}`, 'bootstrap-auth');
};
bootstrap();
