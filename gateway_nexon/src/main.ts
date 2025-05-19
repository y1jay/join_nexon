import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { Logger } from '@nestjs/common';
const cookieParser = require('cookie-parser');

const bootstrap = async () => {
	const config = new ConfigService();
	const port = config.get('port');

	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	await app.listen(port);

	Logger.log(`🚀 Application Port Is ${JSON.stringify(port)}`, 'bootstrap');
};
bootstrap();

