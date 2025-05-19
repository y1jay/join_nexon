import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import * as util from '../common/util';
export type EventHistoryDocument = HydratedDocument<EventHistory>;

// 지급 이력 스키마
@Schema({ collection: 'eventHistory' })
export class EventHistory {
	// 유저 정보
	@Prop({ required: true })
	user_id: string;

	// 이벤트ID
	@Prop({ required: true })
	event_id: string;

	// 미션
	@Prop({ required: true })
	mission: string;

	// 지급 조건 진행값  실패 , 진행중, 성공, 지급완료
	@Prop({ required: true })
	provide_state: string;

	//  등록타입
	@Prop({ required: true })
	register: string;

	//  등록자
	@Prop({ required: true })
	regist_id: string;

	//  등록일
	@Prop({ default: util.getNow() })
	regist_date?: Date;

	// // 지급자
	// @Prop({ default: '' })
	// provider?: string;

	// // 지급자 ID
	// @Prop({ default: '' })
	// provide_id?: string;

	// // 지급일
	// @Prop({ default: null })
	// provide_date?: Date;
}

export const EventHistorySchema = SchemaFactory.createForClass(EventHistory);
