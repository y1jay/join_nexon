import { Controller } from '@nestjs/common';
import { EventService } from './event.service';
import { MessagePattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Result } from './dto/result';
import { Event } from './schemas/event.schema';
import { EventReward } from './schemas/eventReward.schema';
import { Item } from './schemas/item.schema';
import { Provide } from './schemas/provide.schema';
import { EventHistory } from './schemas/eventHistory.schema';

@Controller()
export class EventController {
	constructor(private readonly eventService: EventService) {}

	/**
	 * 권한 : ADMIN
	 * 모든 기능 컨트롤 가능 -> 이력 user 대신 관리자 변동
	 */

	/**
	 * 권한 : USER
	 * 보상 요청 (이벤트 진행 여부,조건 충족 여부, 보상 지급, 보상 이력,중복 보상 제외 )
	 */
	@MessagePattern({ cmd: 'eventAccess' })
	eventAccess(org: EventHistory): Promise<any> {
		return this.eventService.eventAccess(org);
	}

	// 이벤트 실행
	@MessagePattern({ cmd: 'eventRefresh' })
	eventPlay(org: { answer: boolean }): Promise<Result<any>> {
		return this.eventService.eventRefresh(org);
	}
	// 이벤트 조회(유저용)
	@MessagePattern({ cmd: 'activeEvent' })
	eventProvideAttain(org: { page: number; limit: number; sort: any }): Promise<Result<any>> {
		return this.eventService.activeEvent(org);
	}

	/**
	 * 권한 : OPERATOR
	 * 이벤트 등록, 수정
	 * 이벤트 보상 등록
	 * 보상 이력 조회
	 */
	// -------------------ITEM----------------------
	// 이벤트 아이템 등록 (아이템명,아이템 효과,아이템 가격,사용여부)!
	@MessagePattern({ cmd: 'eventItemRegistration' })
	eventItemRegistration(dto: Item): Promise<Result<Item>> {
		return this.eventService.eventItemRegistration(dto);
	}

	// 보상에 아이템 사용안함 처리
	@MessagePattern({ cmd: 'eventItemModify' })
	itemModify(org: {
		item_id: string;
		item_name?: string;
		item_type?: string;
		item_effect?: string;
		use_yn?: boolean;
		modifier: string;
		modify_id: string;
	}): Promise<Result<Item>> {
		return this.eventService.itemModify(org);
	}

	// 이벤트 아이템 리스트 (아이템명,아이템 효과,아이템 가격,사용여부)!
	@MessagePattern({ cmd: 'eventItemList' })
	eventItemList(org: { page: number; limit: number; sort: any }): Promise<Item[]> {
		return this.eventService.itemList(org);
	}

	// -------------------REWARD----------------------
	// 이벤트 보상 정보 등록 (이벤트정보,아이템 정보,획득일시,사용여부)!
	@MessagePattern({ cmd: 'eventRewardRegistration' })
	eventRewardRegistration(dto: EventReward): Promise<Result<EventReward>> {
		return this.eventService.eventRewardRegistration(dto);
	}
	// 이벤트 보상에 아이템정보 삽입
	@MessagePattern({ cmd: 'eventRewardModify' })
	eventRewardItemSet(org: {
		reward_id: string;
		reward_round?: string;
		item_id?: string;
		reward_count?: number;
		use_yn?: boolean;
		modifier: string;
		modify_id: string;
	}): Promise<Result<EventReward>> {
		return this.eventService.eventRewardModify(org);
	}
	// 이벤트 보상 리스트 (이벤트정보,아이템 정보,보상 아이템 갯수,획득일시,사용여부)!
	@MessagePattern({ cmd: 'eventRewardList' })
	eventRewardList(org: { page: number; limit: number; sort: any }): Promise<EventReward[]> {
		return this.eventService.eventRewardList(org);
	}

	// -------------------PROVIDE----------------------
	// 이벤트 획득 조건 등록 (행위)
	@MessagePattern({ cmd: 'eventProvideActionRegistration' })
	eventProvideActionRegistration(dto: Provide): Promise<Result<Provide>> {
		return this.eventService.eventProvideActionRegistration(dto);
	}

	// 이벤트 획득 조건 리스트 (행위)
	@MessagePattern({ cmd: 'eventProvideActionList' })
	eventProvideActionList(org: { page: number; limit: number; sort: any }): Promise<Provide[]> {
		return this.eventService.eventProvideActionList(org);
	}

	// 이벤트 획득 조건 사용안함처리
	@MessagePattern({ cmd: 'eventProvideActionModify' })
	eventProvideActionModify(org: {
		provide_id: string;
		action?: string;
		reward_id?: string;
		use_yn?: boolean;
		modifier: string;
		modify_id: string;
	}): Promise<Result<Provide>> {
		return this.eventService.eventProvideActionModify(org);
	}

	// ------------------EVENT----------------------
	// 이벤트 등록 (시작일시,종료일시,  보상정보, 활성/비활성 정보)!
	@MessagePattern({ cmd: 'eventRegistration' })
	eventRegistration(dto: Event): Promise<Result<Event>> {
		return this.eventService.eventRegistration(dto);
	}

	// 이벤트 수정 (시작일시,종료일시,  보상정보, 활성/비활성 정보)!
	@MessagePattern({ cmd: 'eventModify' })
	eventModify(org: {
		event_id: string;
		event_name?: string;
		start_date?: Date;
		end_date?: Date;
		provide_id?: string;
		use_yn?: boolean;
		modifier: string;
		modify_id: string;
	}): Promise<Result<Event>> {
		return this.eventService.eventModify(org);
	}

	// 이벤트 리스트 (시작일시,종료일시, 보상 획득 조건, 보상정보, 활성/비활성 정보)
	@MessagePattern({ cmd: 'eventList' })
	eventList(org: { page: number; limit: number; sort: any }): Promise<Event[]> {
		return this.eventService.eventList(org);
	}
	// 이벤트 지급
	@MessagePattern({ cmd: 'eventProvideRequest' })
	eventProvideRequest(org: {
		history_id?: string;
		event_id?: string;
		request_user_id: string;
		login_type: string;
	}): Promise<Event[]> {
		return this.eventService.eventProvideRequest(org);
	}

	/**
	 * 권한 : AUDITOR & OPERATOR
	 * 보상 이력 조회
	 */
	// 보상 이력 조회 (이벤트 정보, 아이템 정보, 수령자 정보(관리자ADMIN,사용자),획득일시)
	@MessagePattern({ cmd: 'eventHistoryList' })
	eventHistoryList(org: { user_id?: string; page: number; limit: number; sort: any }): Promise<any> {
		return this.eventService.eventHistoryList(org);
	}
}
