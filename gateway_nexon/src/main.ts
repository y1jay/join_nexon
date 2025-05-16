import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { Logger } from '@nestjs/common';

const bootstrap = async () => {
	const config = new ConfigService();
	const port = config.get('port');
	const app = await NestFactory.create(AppModule);
	await app.listen(port);

	Logger.log(`🚀 Application Port Is ${JSON.stringify(port)}`, 'bootstrap');
};
bootstrap();

