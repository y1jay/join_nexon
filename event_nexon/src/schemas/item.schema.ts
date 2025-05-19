import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as util from '../common/util';
export type ItemDocument = HydratedDocument<Item>;

// 아이템 스키마
@Schema({ collection: 'item' })
export class Item {
	// 아이템 명
	@Prop({ required: true })
	item_name: string;

	// 아이템 타입
	@Prop({ required: true })
	item_type: string;

	// 아이템 효과
	@Prop({ required: true })
	item_effect: string;

	// 아이템 사용가능여부
	@Prop({ required: true })
	use_yn: boolean;
	
	// 아이템 등록타입
	@Prop({ required: true })
	register: string;

	// 아이템 등록자
	@Prop({ required: true })
	regist_id: string;

	// 아이템 등록일
	@Prop({default:util.getNow()})
	regist_date: Date;

	// 아이템 수정자
	@Prop({ default: '' })
	modifier?: string;

	// 아이템 수정자id
	@Prop({default:''})
	modify_id?: string;

	// 아이템 수정일
	@Prop({default:util.getNow()})
	modify_date?: Date;


}

export const ItemSchema = SchemaFactory.createForClass(Item);
