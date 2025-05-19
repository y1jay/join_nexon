import { Controller } from '@nestjs/common';
import { EventService } from './event.service';
import { MessagePattern } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Result } from './dto/result';
import { Event } from './schemas/event.schema';
import { EventReward } from './schemas/eventReward.schema';
import { Item } from './schemas/item.schema';

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
	@MessagePattern({ cmd: 'eventGet' })
	eventGet(dto: { _id: string; grade: string }): Promise<Result<any>> {
		// return this.eventService
		return;
	}

	// 이벤트 획득 조건 달성 여부 [이벤트 별 달성 횟수 등등]
	@MessagePattern({ cmd: 'eventProvideAttain' })
	eventProvideAttain(grade_user_dto: { _id: string; grade: string }): Promise<Result<any>> {
		// return this.eventService
		return;
	}

	/**
	 * 권한 : OPERATOR
	 * 이벤트 등록, 수정
	 * 이벤트 보상 등록
	 * 보상 이력 조회
	 */
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
		modifier?: string;
		modify_id?: string;
		modify_date: Date;
	}): Promise<Result<Event>> {
		return this.eventService.eventModify(org);
	}

	// 이벤트 리스트 (시작일시,종료일시, 보상 획득 조건, 보상정보, 활성/비활성 정보) TODO
	@MessagePattern({ cmd: 'eventList' })
	eventList(org: { page: number; limit: number; sort: string }): Promise<Event[]> {
		return this.eventService.eventList(org);
	}

	// -------------------REWARD----------------------
	// 이벤트 보상 정보 등록 (이벤트정보,아이템 정보,획득일시,사용여부)!
	@MessagePattern({ cmd: 'eventRewardRegistration' })
	eventRewardRegistration(dto: EventReward): Promise<Result<EventReward>> {
		return this.eventService.eventRewardRegistration(dto);
	}
	// 이벤트에 보상 삽입
	@MessagePattern({ cmd: 'eventRewardSet' })
	eventRewardSet(dto: {}): Promise<Result<any>> {
		// return this.eventService
		return;
	}
	// 이벤트에 보상 제거
	@MessagePattern({ cmd: 'eventRewardRevoke' })
	eventRewardRevoke(dto: {}): Promise<Result<any>> {
		// return this.eventService
		return;
	}
	// 이벤트 보상 리스트 (이벤트정보,아이템 정보,보상 아이템 갯수,획득일시,사용여부)!
	@MessagePattern({ cmd: 'eventRewardList' })
	eventRewardList(org: { page: number; limit: number; sort: string }): Promise<EventReward[]> {
		return this.eventService.rewardList(org);
	}
	// 이벤트 보상에 아이템정보 삽입
	@MessagePattern({ cmd: 'eventRewardItemSet' })
	eventRewardItemSet(dto: { _id: string; grade: string }): Promise<Result<any>> {
		// return this.eventService
		return;
	}

	// -------------------ITEM----------------------
	// 이벤트 아이템 등록 (아이템명,아이템 효과,아이템 가격,사용여부)!
	@MessagePattern({ cmd: 'eventItemRegistration' })
	eventItemRegistration(dto: Item): Promise<Result<Item>> {
		return this.eventService.eventItemRegistration(dto);
	}

	// 이벤트 아이템 리스트 (아이템명,아이템 효과,아이템 가격,사용여부)!
	@MessagePattern({ cmd: 'eventItemList' })
	eventItemList(org: { page: number; limit: number; sort: string }): Promise<Item[]> {
		return this.eventService.itemList(org);
	}
	// 보상에 아이템 사용안함 처리
	@MessagePattern({ cmd: 'eventItemUpdate' })
	itemUpdate(org: { item_id: string }): Promise<Result<Item>> {
		return this.eventService.itemUpdate(org);
	}

	// -------------------PROVIDE----------------------
	// 이벤트 획득 조건 등록 (행위)
	@MessagePattern({ cmd: 'eventProvideActionRegistration' })
	eventProvideActionRegistration(grade_user_dto: { _id: string; grade: string }): Promise<Result<any>> {
		// return this.eventService
		return;
	}

	// 이벤트 획득 조건 리스트 (행위)
	@MessagePattern({ cmd: 'eventProvideActionList' })
	eventProvideActionList(grade_user_dto: { _id: string; grade: string }): Promise<Result<any>> {
		// return this.eventService
		return;
	}

	// 이벤트 획득 조건 사용안함처리
	@MessagePattern({ cmd: 'eventProvideActionRevoke' })
	eventProvideActionRevoke(grade_user_dto: { _id: string; grade: string }): Promise<Result<any>> {
		// return this.eventService
		return;
	}

	/**
	 * 권한 : AUDITOR & OPERATOR
	 * 보상 이력 조회
	 */
	// 보상 이력 조회 (이벤트 정보, 아이템 정보, 수령자 정보(관리자ADMIN,사용자),획득일시)
	@MessagePattern({ cmd: 'eventProvideHistory' })
	eventProvideHistory(grade_user_dto: { _id: string; grade: string }): Promise<Result<any>> {
		// return this.eventService
		return;
	}
}

