import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LoginDocument = HydratedDocument<Login>;

@Schema({ collection: 'login' })
export class Login {
	@Prop({ required: true })
	user_id: string;

	@Prop({ required: true })
	regist_date: Date;

	@Prop({ required: true })
	access_token: string;

	@Prop({ required: true })
	refresh_token: string;
}

export const LoginSchema = SchemaFactory.createForClass(Login);

