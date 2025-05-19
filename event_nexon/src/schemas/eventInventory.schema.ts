import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import * as util from '../common/util';
export type EventInventoryDocument = HydratedDocument<EventInventory>;

// 지급 이력 스키마
@Schema({ collection: 'eventInventory' })
export class EventInventory {
	// 유저 정보
	@Prop({ required: true })
	user_id: string;

	// 아이템 ID
	@Prop({ required: true })
	item_id: string;

	// 이벤트 ID
	@Prop({ required: true })
	event_id: string;

	//  등록타입
	@Prop({ required: true })
	register: string;

	//  등록자
	@Prop({ required: true })
	regist_id: string;

	//  등록일
	@Prop({ default: util.getNow() })
	regist_date: Date;
}

export const EventInventorySchema = SchemaFactory.createForClass(EventInventory);
