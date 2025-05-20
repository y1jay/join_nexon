import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const cookieParser = require('cookie-parser');

const bootstrap = async () => {
	const config = new ConfigService();
	const port = config.get('port');

	const app = await NestFactory.create(AppModule);
	app.use(cookieParser());
	const swaggerConfig = new DocumentBuilder().addBearerAuth().build();
	const doc = SwaggerModule.createDocument(app, swaggerConfig);

	SwaggerModule.setup('ApiDocument', app, doc);
	await app.listen(port, '0.0.0.0');

	Logger.log(`🚀 GateWay Port Is ${JSON.stringify(port)},${process.env.PORT}`, 'GateWay');
};
bootstrap();
