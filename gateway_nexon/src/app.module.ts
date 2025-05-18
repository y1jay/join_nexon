import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from './config/config.service';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './interceptor/response.intercepter';
import { jwtAuthGuard } from './guard/auth.guard';
import { AllExceptionsFilter } from './exceptions/allException.filter';
import { JwtAccessStrategy } from './auth/jwtAccess.strategy';
import { JwtRefreshStrategy } from './auth/jwtRefresh.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		PassportModule,
		JwtModule.register({
			secret: process.env.JWT_SECRET,
		}),
		// MongooseModule.forRoot(process.env.DB_URL)
	],
	controllers: [AuthController],
	providers: [
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ResponseInterceptor,
		},
		{
			provide: APP_GUARD,
			useClass: jwtAuthGuard,
		},
		JwtAccessStrategy,
		JwtRefreshStrategy,
		ConfigService,
		{
			provide: 'AUTH_SERVICE',
			useFactory: (configService: ConfigService) => {
				return ClientProxyFactory.create(configService.get('auth_service'));
			},
			inject: [ConfigService],
		},
		{
			provide: 'EVENT_SERVICE',
			useFactory: (configService: ConfigService) => {
				return ClientProxyFactory.create(configService.get('event_service'));
			},
			inject: [ConfigService],
		},
		AuthService,
	],
	exports: [PassportModule],
})
export class AppModule {}
