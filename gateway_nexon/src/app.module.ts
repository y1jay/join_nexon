import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from './config/config.service';
import { AuthController } from './controllers/auth.controller';
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		// MongooseModule.forRoot(process.env.DB_URL)
	],
	controllers: [AppController, AuthController],
	providers: [
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
		AppService,
	],
})
export class AppModule {}

