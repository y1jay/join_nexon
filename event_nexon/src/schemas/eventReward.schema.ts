import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import * as util from '../common/util';
export type EventRewardDocument = HydratedDocument<EventReward>;

// 지급정보 스키마
@Schema({ collection: 'eventReward' })
export class EventReward {
	// 보상 명
	@Prop({ required: true })
	reward_name: string;

	// 지급조건 id
	@Prop({ required: true })
	provide_id: string;

	// 등록자 타입
	@Prop({ required: true })
	register: string;

	// 등록자 ID
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

	// 활성 비활성 여부
	@Prop({ required: true })
	use_yn: boolean;
}

export const EventRewardSchema = SchemaFactory.createForClass(EventReward);
