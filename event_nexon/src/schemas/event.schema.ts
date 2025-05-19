import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as util from '../common/util';
export type EventDocument = HydratedDocument<Event>;

// 이벤트 스키마
@Schema({ collection: 'event' })
export class Event {
	// 이벤트명
	@Prop({ required: true })
	event_name: string;

	// 시작일시
	@Prop({ required: true })
	start_date: Date;

	// 종료일시
	@Prop({ required: true })
	end_date: Date;

	// 사용 여부
	@Prop({ required: true })
	use_yn: boolean;

	// 등록자
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

	// 수정자 ID
	@Prop({ default: '' })
	modify_id?: string;

	// 수정일
	@Prop({ default: util.getNow() })
	modify_date?: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
EventSchema.index({ start_date: 1, end_date: 1 });
