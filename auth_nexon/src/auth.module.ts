import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { User, UserSchema } from './schemas/user.schema';
import { Login, LoginSchema } from './schemas/login.schema';
import { JwtModule } from '@nestjs/jwt';
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		MongooseModule.forRootAsync({ useFactory: () => ({ uri: process.env.DB_URL }) }),
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Login.name, schema: LoginSchema },
		]),
		JwtModule.register({
			secret: process.env.JWT_SECRET,
		}),
	],
	controllers: [AuthController],
	providers: [
		// {
		// 	provide: APP_INTERCEPTOR,
		// 	useClass: ResponseInterceptor,
		// },
		AuthService,
	],
})
export class AppModule {}
