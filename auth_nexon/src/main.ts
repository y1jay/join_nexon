
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { Logger } from '@nestjs/common';

const bootstrap = async () => {
	const config = new ConfigService();
	const options = config.get('service');
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AppModule,
		options,
	);
	await app.listen();

	Logger.log(
		`🚀 Application is running on: TCP ${JSON.stringify(options)}`,
		'bootstrap-msa',
	);
}
bootstrap();