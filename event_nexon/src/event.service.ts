import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Provide, ProvideDocument } from './schemas/provide.schema';
import mongoose from 'mongoose';
import { Model } from 'mongoose';
import * as util from './common/util';
import { Result } from './dto/result';
import { Event, EventDocument } from './schemas/event.schema';
import { Item, ItemDocument } from './schemas/item.schema';
import { EventReward, EventRewardDocument } from './schemas/eventReward.schema';
import { EventHistory, EventHistoryDocument } from './schemas/eventHistory.schema';
@Injectable()
export class EventService {
	constructor(
		// 이벤트 스키마 주입
		@InjectModel(Event.name)
		private event: Model<EventDocument>,

		// 아이템 스키마 주입
		@InjectModel(Item.name)
		private item: Model<ItemDocument>,

		// 아이템 스키마 주입
		@InjectModel(EventReward.name)
		private reward: Model<EventRewardDocument>,

		// 획득조건 스키마 주입
		@InjectModel(Provide.name)
		private provide: Model<ProvideDocument>,

		// 획득 이력 스키마 주입
		@InjectModel(EventHistory.name)
		private history: Model<EventHistoryDocument>,

		// 커넥션
		@InjectConnection()
		private readonly conn: mongoose.Connection
	) {}
	// ------------------EVENT-------------------
	// 이벤트 등록
	async eventRegistration(dto: Event): Promise<Result<Event>> {
		let new_event: any;
		try {
			new_event = new this.event(dto).save();
		} catch (e) {
			return { statusCode: 400, message: '이벤트 등록 실패', error: e };
		} finally {
			return { statusCode: 200, message: '이벤트 등록 성공', data: new_event };
		}
	}
	// 이벤트 수정
	async eventModify(org: {
		event_id: string;
		event_name?: string;
		start_date?: Date;
		end_date?: Date;
		provide_id?: string;
		use_yn?: boolean;
		modifier: string;
		modify_id: string;
	}): Promise<Result<Event>> {
		// 이벤트 수정
		const event_update = await this.event.updateOne({ _id: org.event_id }, org).exec();
		if (event_update.modifiedCount > 0) {
			return { statusCode: 200, message: `[${org.event_id}] ${org} 변경 성공` };
		} else {
			return { statusCode: 400, message: '이벤트 변경 실패' };
		}
	}
	// 이벤트 리스트 TODO:진행중, 종료, 예정
	async eventList(org: { page: number; limit: number; sort: string }): Promise<Event[]> {
		return this.event.find({ skip: (org.page - 1) * org.limit, take: org.limit, sort: { regist_date: org.sort } });
	}

	// ------------------ITEM--------------------
	// 아이템 등록
	async eventItemRegistration(dto: Item): Promise<Result<Item>> {
		let new_item: any;
		const item_type = util.itemType(dto.item_type);
		if (!item_type) {
			return { statusCode: 401, message: '아이템 타입이 잘못됐습니다.' };
		}
		try {
			new_item = new this.item(dto).save();
		} catch (e) {
			return { statusCode: 400, message: '아이템 등록 실패', error: e };
		} finally {
			return { statusCode: 200, message: '아이템 등록 성공', data: new_item };
		}
	}
	// 아이템 리스트
	async itemList(org: { page: number; limit: number; sort: string }): Promise<Item[]> {
		return this.item.find({ skip: (org.page - 1) * org.limit, take: org.limit, sort: { regist_date: org.sort } });
	}
	// 아이템 수정
	async itemUpdate(org: {
		item_id: string;
		item_name?: string;
		item_type?: string;
		use_yn?: boolean;
		modifier: string;
		modify_id: string;
	}): Promise<Result<Item>> {
		// 리워드 확인
		const item_type = util.itemType(org.item_type);
		if (!item_type) {
			return { statusCode: 401, message: '아이템 타입이 잘못됐습니다.' };
		}
		const item_update = await this.item.updateOne({ _id: org.item_id }, { org }).exec();
		if (item_update.modifiedCount > 0) {
			return { statusCode: 200, message: `[${org.item_id}] ${org} 삭제 성공` };
		} else {
			return { statusCode: 400, message: '아이템 수정 실패' };
		}
	}

	// ----------------REWARD--------------------
	// 보상 등록
	async eventRewardRegistration(dto: EventReward): Promise<Result<EventReward>> {
		let new_event_reward: any;
		const item = await this.item.findOne({ item_id: dto.item_id }).exec();
		if (!item) {
			return { statusCode: 401, message: '아이템 정보 없음' };
		}
		try {
			new_event_reward = new this.reward(dto).save();
		} catch (e) {
			return { statusCode: 400, message: '이벤트 보상 등록 실패', error: e };
		} finally {
			return { statusCode: 200, message: '이벤트 보상 등록 성공', data: new_event_reward };
		}
	}
	// 보상 리스트
	async rewardList(org: { page: number; limit: number; sort: string }): Promise<EventReward[]> {
		return this.reward.find({ skip: (org.page - 1) * org.limit, take: org.limit, sort: { regist_date: org.sort } });
	}
	// 보상정보 수정
	async rewardRevoke(org: {
		reward_id: string;
		reward_round?: string;
		item_id?: string;
		reward_count?: number;
		use_yn?: boolean;
		modifier: string;
		modify_id: string;
	}): Promise<Result<EventReward>> {
		// 지급 조건 확인
		const provide = await this.provide.findOne({ reward_id: org.reward_id }).exec();
		if (provide && org.use_yn == false) {
			return { statusCode: 401, message: '지급조건을 먼저 제거해주세요' };
		}
		const reward_update = await this.reward.updateOne({ _id: org.reward_id }, { use_yn: false }).exec();
		if (reward_update.modifiedCount > 0) {
			return { statusCode: 200, message: `[${org.reward_id}] ${org} 삭제 성공` };
		} else {
			return { statusCode: 400, message: '아이템 삭제 실패' };
		}
	}
	// ----------------PROVIDE------------------
	// 보상 조건 등록
	async eventProvideActionRegistration(dto: Provide): Promise<Result<Provide>> {
		let new_provide_action: any;
		// 액션 확인
		const action = util.provideReason(dto.action);
		if (!action) {
			return { statusCode: 400, message: '보상조건 정보 없음' };
		}
		try {
			new_provide_action = new this.provide(dto).save();
		} catch (e) {
			return { statusCode: 400, message: '보상조건 등록 실패', error: e };
		} finally {
			return { statusCode: 200, message: '보상조건 등록 성공', data: new_provide_action };
		}
	}
	// 보상 조건 리스트
	async eventProvideActionList(org: { page: number; limit: number; sort: string }): Promise<Provide[]> {
		return this.provide.find({
			skip: (org.page - 1) * org.limit,
			take: org.limit,
			sort: { regist_date: org.sort },
		});
	}
	// 보상조건 삭제
	async eventProvideActionRevoke(org: { provide_id: string }): Promise<Result<Provide>> {
		// 지급 조건 확인
		const provide = await this.event.findOne({ provide_id: org.provide_id }).exec();
		if (provide) {
			return { statusCode: 400, message: '이벤트를 먼저 제거해주세요' };
		}
		const reward_update = await this.reward.updateOne({ _id: org.provide_id }, { use_yn: false }).exec();
		if (reward_update.modifiedCount > 0) {
			return { statusCode: 200, message: `[${org.provide_id}] ${org} 삭제 성공` };
		} else {
			return { statusCode: 401, message: '보상조건 삭제 실패' };
		}
	}
	// ----------------HISTORY------------------
	// 보상 이력등록
	async eventHistoryRegistration(dto: EventHistory): Promise<Result<EventHistory>> {
		let new_event_history: any;
		try {
			new_event_history = new this.history(dto).save();
		} catch (e) {
			return { statusCode: 200, message: '이벤트 등록 성공', error: e };
		} finally {
			return { statusCode: 200, message: '이벤트 등록 성공', data: new_event_history };
		}
	}
}

