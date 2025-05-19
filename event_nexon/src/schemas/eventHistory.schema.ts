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

	// 수령자
	@Prop({ required: true })
	provider: string;

	// 수령자 ID
	@Prop({ required: true })
	provide_id: string;

	// 수령일
	@Prop({ default:util.getNow()})
	provide_date: Date;

}

export const EventHistorySchema = SchemaFactory.createForClass(EventHistory);
