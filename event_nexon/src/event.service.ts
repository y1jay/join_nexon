import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Provide, ProvideDocument } from './schemas/provide.schema';
import mongoose from 'mongoose';
import { Model, Types } from 'mongoose';
import * as util from './common/util';
import { Result } from './dto/result';
import { Event, EventDocument } from './schemas/event.schema';
import { Item, ItemDocument } from './schemas/item.schema';
import { EventReward, EventRewardDocument } from './schemas/eventReward.schema';
import { EventHistory, EventHistoryDocument } from './schemas/eventHistory.schema';
import { EventInventory, EventInventoryDocument } from './schemas/eventInventory.schema';

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

		// 이벤트 인벤토리 스키마 주입
		@InjectModel(EventInventory.name)
		private inventory: Model<EventInventoryDocument>,

		// 커넥션
		@InjectConnection()
		private readonly conn: mongoose.Connection
	) {}

	// ------------------ITEM--------------------
	// 아이템 등록
	async eventItemRegistration(dto: Item): Promise<Result<Item>> {
		let new_item: any;
		const reward_id = Types.ObjectId.isValid(dto.reward_id);
		if (!reward_id) {
			return { statusCode: 400, message: '잘못 된 ID 입니다' };
		}
		const reward = await this.reward.findById(dto.reward_id).exec();
		if (!reward) {
			return { statusCode: 400, message: '보상정보가 없습니다.' };
		}
		const reward_second = await this.reward.find({
			_id: dto.reward_id,
			item_type: dto.item_type,
			item_name: dto.item_name,
			item_effect: dto.item_effect,
		});
		if (reward_second.length > 0) {
			return { statusCode: 400, message: '이미 같은 보상이 있습니다.' };
		}
		try {
			new_item = new this.item(dto).save();
		} catch (e) {
			return { statusCode: 400, message: '아이템 등록 실패', error: e };
		} finally {
			return { statusCode: 200, message: '아이템 등록 성공', data: await new_item };
		}
	}
	// 아이템 리스트
	async itemList(org: { page: number; limit: number; sort: any }): Promise<Item[]> {
		return this.item
			.find()
			.skip((org.page - 1) * org.limit)
			.limit(org.limit)
			.sort({ regist_date: org.sort })
			.exec();
	}
	// 아이템 수정
	async itemModify(org: {
		item_id: string;
		item_name?: string;
		item_type?: string;
		reward_id?: string;
		use_yn?: boolean;
		modifier: string;
		modify_id: string;
	}): Promise<Result<Item>> {
		const objectId = Types.ObjectId.isValid(org.item_id);
		console.log(objectId, 'ID###');
		if (!objectId) {
			return { statusCode: 401, message: '잘못 된 ID 입니다' };
		}
		const reward_id = Types.ObjectId.isValid(org.reward_id);
		if (!reward_id) {
			return { statusCode: 402, message: '잘못 된 ID 입니다' };
		}
		const reward = await this.reward.findById(org.reward_id).exec();
		if (!reward) {
			return { statusCode: 401, message: '보상정가 없습니다.' };
		}
		const item_update = await this.item
			.updateOne({ _id: org.item_id }, { ...org, modify_date: util.getNow() })
			.exec();
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
		// 아이템 타입 확인
		if (dto.provide_id) {
			const objectId = Types.ObjectId.isValid(dto.provide_id);
			if (!objectId) {
				return { statusCode: 401, message: '잘못 된 ID 입니다' };
			}

			const provide = await this.provide.findById(dto.provide_id).exec();
			if (!provide) {
				return { statusCode: 401, message: '보상 획득 정보가 없습니다.' };
			}
		}

		try {
			new_event_reward = new this.reward(dto).save();
		} catch (e) {
			return { statusCode: 400, message: '이벤트 보상 등록 실패', error: e };
		} finally {
			return { statusCode: 200, message: '이벤트 보상 등록 성공', data: await new_event_reward };
		}
	}

	// 보상정보 수정
	async eventRewardModify(org: {
		reward_id: string;
		reward_round?: string;
		provide_id?: string;
		reward_count?: number;
		use_yn?: boolean;
		modifier: string;
		modify_id: string;
	}): Promise<Result<EventReward>> {
		const objectId = Types.ObjectId.isValid(org.provide_id);
		if (!objectId) {
			return { statusCode: 401, message: '잘못 된 ID 입니다' };
		}
		const provide = await this.provide.findById(org.provide_id).exec();
		if (!provide) {
			return { statusCode: 401, message: '아이템정보가 없습니다' };
		}
		const reward_update = await this.reward
			.updateOne({ _id: org.reward_id }, { ...org, modify_date: util.getNow() })
			.exec();
		if (reward_update.modifiedCount > 0) {
			return { statusCode: 200, message: `[${org.reward_id}] ${Object.keys(org)} 수정 성공` };
		} else {
			return { statusCode: 400, message: '보상 수정 실패' };
		}
	}
	// 보상 리스트
	async eventRewardList(org: { page: number; limit: number; sort: any }): Promise<EventReward[]> {
		return this.reward
			.find()
			.skip((org.page - 1) * org.limit)
			.limit(org.limit)
			.sort({ regist_date: org.sort })
			.exec();
	}

	// ----------------PROVIDE------------------
	// 보상 조건 등록
	async eventProvideActionRegistration(dto: Provide): Promise<Result<Provide>> {
		let new_provide_action: any;
		// 액션 확인
		const action = util.provideReason(dto.action);
		if (!action) {
			return { statusCode: 401, message: '보상조건 정보 없음' };
		}
		// id 값 확인
		const objectId = Types.ObjectId.isValid(dto.event_id);
		if (!objectId) {
			return { statusCode: 401, message: '잘못 된 ID 입니다' };
		}
		// 이벤트 키 확인
		const event = await this.event.findById(dto.event_id).exec();
		if (!event) {
			return { statusCode: 401, message: '이벤트정보가 없습니다' };
		}

		try {
			new_provide_action = new this.provide(dto).save();
		} catch (e) {
			return { statusCode: 400, message: '보상조건 등록 실패', error: e };
		} finally {
			return { statusCode: 200, message: '보상조건 등록 성공', data: await new_provide_action };
		}
	}
	// 이벤트 액션 리스트
	async eventProvideActionList(org: { page: number; limit: number; sort: any }): Promise<Provide[]> {
		return this.provide
			.find()
			.skip((org.page - 1) * org.limit)
			.limit(org.limit)
			.sort({ regist_date: org.sort })
			.exec();
	}
	// 이벤트 액션 수정
	async eventProvideActionModify(org: {
		provide_id: string;
		action?: string;
		event_id?: string;
		use_yn?: boolean;
		modifier: string;
		modify_id: string;
	}): Promise<Result<Provide>> {
		const provide_valid = Types.ObjectId.isValid(org.provide_id);
		if (!provide_valid) {
			return { statusCode: 401, message: '잘못 된 ID 입니다' };
		}
		const event_valid = Types.ObjectId.isValid(org.event_id);
		if (!event_valid) {
			return { statusCode: 402, message: '잘못 된 ID 입니다' };
		}

		const provide_update = await this.provide
			.updateOne({ _id: org.provide_id }, { ...org, modify_date: util.getNow() })
			.exec();
		if (provide_update.modifiedCount > 0) {
			return { statusCode: 200, message: `[${org.provide_id}] ${Object.keys(org)} 수정 성공` };
		} else {
			return { statusCode: 400, message: '보상조건 수정 실패' };
		}
	}
	// ------------------EVENT-------------------
	// 이벤트 등록
	async eventRegistration(dto: Event): Promise<Result<Event>> {
		let new_event: any;
		// 지금이 종료일보다 이전인가
		if (!util.dayBefore(dto.end_date)) {
			return { statusCode: 401, message: '이벤트 종료일 오류 (지난 날짜)' };
		}
		try {
			new_event = new this.event(dto).save();
		} catch (e) {
			return { statusCode: 400, message: '이벤트 등록 실패', error: e };
		} finally {
			return { statusCode: 200, message: '이벤트 등록 성공', data: await new_event };
		}
	}
	// 이벤트 수정
	async eventModify(org: {
		event_id: string;
		event_name?: string;
		start_date?: Date;
		end_date?: Date;
		use_yn?: boolean;
		modifier: string;
		modify_id: string;
	}): Promise<Result<Event>> {
		if (org.event_id) {
			const objectId = Types.ObjectId.isValid(org.event_id);
			if (!objectId) {
				return { statusCode: 401, message: '잘못 된 ID 입니다' };
			}
		}

		const event_update = await this.event
			.updateOne({ _id: org.event_id }, { ...org, modify_date: util.getNow() })
			.exec();
		if (event_update.modifiedCount > 0) {
			return { statusCode: 200, message: `[${org.event_id}] ${Object.keys(org)} 변경 성공` };
		} else {
			return { statusCode: 400, message: '이벤트 변경 실패' };
		}
	}
	// 이벤트 리스트
	async eventList(org: { page: number; limit: number; sort: any }): Promise<Event[]> {
		let eventList = [];
		const dbList = await this.event
			.find()
			.skip((org.page - 1) * org.limit)
			.limit(org.limit)
			.sort({ regist_date: org.sort })
			.exec();
		// 날짜별 이벤트 진행 여부 확인
		dbList.map((e: any) => {
			let state: string = '예정';
			if (e.use_yn && util.dayBefore(e.end_date)) {
				state = '진행';
			} else {
				state = '종료';
			}

			eventList.push({ ...e._doc, state: state });
		});
		return eventList;
	}
	// 보상 요청 처리(지급) 유저아이디, 히스토리아이디, 이벤트 아이디 중 하나만
	async eventProvideRequest(org: {
		history_id?: string;
		event_id?: string;
		request_user_id: string;
		login_type: string;
	}): Promise<any> {
		let provide = [];
		let process = { success: 0, failed: 0 };
		if (org.history_id) {
			const objectId = Types.ObjectId.isValid(org.history_id);
			if (!objectId) {
				return { statusCode: 401, message: '잘못 된 ID 입니다' };
			}
			const progressEvent = await this.history.findOne({ _id: org.history_id, provide_state: '성공' }).exec();
			if (!progressEvent) {
				return { statusCode: 401, message: '지급받을 요청이 없습니다.' };
			} else {
				provide.push(progressEvent);
			}
		} else {
			const objectId = Types.ObjectId.isValid(org.event_id);
			if (!objectId) {
				return { statusCode: 401, message: '잘못 된 ID 입니다' };
			}
			provide = await this.history.find({ event_id: org.event_id, provide_state: '성공' });
		}
		const objectId = Types.ObjectId.isValid(org.request_user_id);
		if (!objectId) {
			return { statusCode: 401, message: '잘못 된 ID 입니다' };
		}
		if (provide.length > 0) {
			for (let pv of provide) {
				// 지급 행위 확인
				const provide = await this.provide.findOne({ event_id: pv.event_id });
				if (!provide) {
					process.failed++;
					continue;
				}
				// 지급정보 확인
				const reward = await this.reward.findOne({ provide_id: provide._id });
				if (!reward) {
					process.failed++;
					continue;
				}
				// 아이템 확인
				const item = await this.item.findOne({ reward_id: reward._id });
				if (!item) {
					process.failed++;
					continue;
				}
				const new_inven = new this.inventory({
					user_id: pv.user_id,
					item_id: item._id,
					register: org.login_type,
					event_id: org.event_id,
					regist_id: org.request_user_id,
				}).save();
				if (!(await new_inven)) {
					process.failed++;
					continue;
				} else {
					process.success++;
				}
			}
		}

		return process;
	}

	// ----------------HISTORY------------------
	// 보상 지급 요청 이력조회 AUDITOR
	// 이벤트별, 상태별, 지급조건별
	async eventHistoryList(org: any): Promise<any> {
		let inventoryList = [];
		let findOrg = { provide_state: '성공' };
		if (org.user_id) {
			Object.assign(findOrg, { user_id: org.user_id });
		}
		const eventRequest = await this.history
			.find(findOrg)
			.skip((org.page - 1) * org.limit)
			.limit(org.limit)
			.sort({ regist_date: org.sort })
			.exec();

		const inventory = await this.inventory
			.find(findOrg)
			.skip((org.page - 1) * org.limit)
			.limit(org.limit)
			.sort({ regist_date: org.sort })
			.exec();
		inventory.map(async (e: any) => {
			const event = await this.event.findById(e.event_id);
			inventoryList.push({ ...e._doc, ...event });
		});
		console.log(eventRequest, '@>@>>@');
		return { eventRequest, inventory };
	}
	// ----------------PLAY---------------------
	// 회원용 이벤트 확인 (진행중인것만)
	async activeEvent(org: any): Promise<any> {
		// 실행 중인 이벤트인지 확인
		// 이벤트에 지급조건, 지급정보, 아이템 정보가 있는지 확인
		let eventList = [];
		const dbList = await this.event
			.find()
			.skip((org.page - 1) * org.limit)
			.limit(org.limit)
			.sort({ regist_date: org.sort })
			.exec();
		// 날짜별 이벤트 진행 여부 확인
		dbList.map(async (e: any) => {
			if (e.use_yn && util.dayBefore(e.end_date)) {
				eventList.push(e._doc);
			}
		});
		return eventList;
	}
	// 이벤트 이력 생성
	async eventAccess(org: any): Promise<any> {
		// 이벤트 id 로 Provide 확인
		const event_id = Types.ObjectId.isValid(org.event_id);
		if (!event_id) {
			return { statusCode: 401, message: '잘못 된 이벤트정보 입니다' };
		}
		const user_id = Types.ObjectId.isValid(org.user_id);
		if (!user_id) {
			return { statusCode: 401, message: '잘못 된 유저정보 입니다' };
		}

		const provideGet = await this.provide.findOne({ event_id: org.event_id, provide_round: 1 });
		if (!provideGet) {
			return { statusCode: 401, message: '이벤트 정보가 없습니다.' };
		}
		const progressEvent = await this.history.find({ user_id: org.user_id, provide_state: '진행' });
		if (progressEvent.length > 0) {
			return { statusCode: 401, message: '이미 진행중인 이벤트가 있습니다.' };
		}
		const mission = util[provideGet.action]();
		// 각 조건별로 이력 생성 > 성공여부 진행으로 생성
		const historyParam: Object = {
			user_id: org.user_id,
			event_id: org.event_id,
			mission: JSON.stringify(mission),
			provide_state: '진행',
			register: org.login_type,
			regist_id: org.user_id,
		};
		const eventHistory = new this.history(historyParam).save();
		if (!(await eventHistory)) {
			return { statusCode: 401, message: '이벤트 참여 실패' };
		}

		return mission.question;
	}
	// 이벤트 진행
	async eventRefresh(org: any): Promise<any> {
		const user_id = Types.ObjectId.isValid(org.user_id);
		if (!user_id) {
			return { statusCode: 401, message: '잘못 된 유저정보 입니다' };
		}
		const progressEvent = await this.history.findOne({ user_id: org.user_id, provide_state: '진행' });
		if (!progressEvent) {
			return { statusCode: 401, message: '참여중인 이벤트가 없습니다.' };
		}
		if (org.answer == null || org.answer == undefined) {
			return progressEvent;
		}
		let event_clear: any;
		let state: string;
		if (org.answer == JSON.parse(progressEvent.mission).result) {
			// 성공
			state = '성공';
			// 지급 요청
			event_clear = await this.history.updateOne({ _id: progressEvent._id }, { provide_state: state }).exec();
		} else {
			// 실패
			state = `실패 [정답] ${JSON.parse(progressEvent.mission).result}`;
			event_clear = await this.history.updateOne({ _id: progressEvent._id }, { provide_state: state }).exec();
		}

		if (event_clear.modifiedCount == 0) {
			return { statusCode: 400, message: '미션 진행 오류' };
		}
		return { statusCode: 200, message: state };
	}
}
