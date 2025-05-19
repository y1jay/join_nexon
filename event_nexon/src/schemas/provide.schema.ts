import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import * as util from '../common/util';
export type ProvideDocument = HydratedDocument<Provide>;

// 지급 조건 스키마
@Schema({ collection: 'provide' })
export class Provide {
	// 지급 조건 행위 [랜덤형,문제형,혼합형]
	@Prop({ required: true })
	action: string;

	// 이벤트 아이디
	@Prop({ required: true })
	event_id: string;

	// 보상 단계
	@Prop({ required: true })
	provide_round: number;

	// 지급 조건 사용 여부
	@Prop({ required: true })
	use_yn: boolean;

	// 등록자
	@Prop({ required: true })
	register: string;

	// 등록자id
	@Prop({ required: true })
	regist_id: string;

	// 등록일
	@Prop({ default: util.getNow() })
	regist_date: Date;

	// 수정자
	@Prop({ default: '' })
	modifier?: string;

	// 수정자id
	@Prop({ default: '' })
	modify_id?: string;

	// 수정일
	@Prop({ default: util.getNow() })
	modify_date?: Date;
}

export const ProvideSchema = SchemaFactory.createForClass(Provide);
