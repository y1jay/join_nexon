import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
const cookieParser = require('cookie-parser');

const bootstrap = async () => {
	// 마이크로 서비스 Config
	const config = new ConfigService();
	const port = config.get('port');

	// 앱 모듈 생성
	const app = await NestFactory.create(AppModule);
	// 쿠키 파싱
	app.use(cookieParser());
	// 스웨거
	const swaggerConfig = new DocumentBuilder().addBearerAuth().build();
	const doc = SwaggerModule.createDocument(app, swaggerConfig);
	// 스웨거 셋업
	SwaggerModule.setup('ApiDocument', app, doc);
	app.enableCors();
	await app.listen(port, '0.0.0.0');

	Logger.log(`🚀 GateWay Port Is ${JSON.stringify(port)},${process.env.PORT}`, 'GateWay');
};
bootstrap();
