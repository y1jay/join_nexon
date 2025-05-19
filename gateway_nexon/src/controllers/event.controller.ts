import { Body, Controller, Get, Inject, Patch, Post, Query, Req, Res, DefaultValuePipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { IsNotEmptyPipe, RequiredValidationPipe } from 'src/pipe/custom.pipe';

import { EventReward, Provide, Event, Item } from 'src/dto/eventDto';
@Controller('event')
export class EventController {
	constructor(
		@Inject('EVENT_SERVICE')
		private readonly EventProxy: ClientProxy
	) {}
	/**
	 * 권한 : ADMIN
	 * 모든 기능 컨트롤 가능 -> 이력 user 대신 관리자 변동
	 */

	/**
	 * 권한 : USER
	 * 보상 요청 (이벤트 진행 여부,조건 충족 여부, 보상 지급, 보상 이력,중복 보상 제외 )
	 */

	// 이벤트 조회(유저용)
	@Get('activeEvent')
	user_activeEvent(
		@Query('page', new DefaultValuePipe(1)) page: number,
		@Query('limit', new DefaultValuePipe(10)) limit: number,
		@Query('limit', new DefaultValuePipe(-1)) sort: string
	): Observable<Event[]> {
		return this.EventProxy.send({ cmd: 'activeEvent' }, { page, limit, sort });
	}
	// 요청 조회(유저용)
	@Get('userEventHistoryList')
	user_eventHistoryList(
		@Query('page', new DefaultValuePipe(1)) page: number,
		@Query('limit', new DefaultValuePipe(10)) limit: number,
		@Query('limit', new DefaultValuePipe(-1)) sort: string,
		@Req() req: Request
	): Observable<any> {
		return this.EventProxy.send({ cmd: 'eventHistoryList' }, { page, limit, sort, user_id: req['user']._id });
	}

	// 이벤트 실행1차 (문제)
	@Post('eventAccess')
	user_eventAccess(
		@Body('event_access_dto', RequiredValidationPipe, IsNotEmptyPipe) dto: any,
		@Req() req: Request
	): Observable<any> {
		dto.login_type = req['user'].login_type;
		dto.user_id = req['user']._id;

		return this.EventProxy.send({ cmd: 'eventAccess' }, dto);
	}
	// 이벤트 실행2차[보상 요청] (답문 및 결과, answer 파라미터 안넣을경우 문제 다시 보기)
	@Patch('eventRefresh')
	user_eventRefresh(
		@Body('event_refresh_dto', RequiredValidationPipe, IsNotEmptyPipe) dto: any,
		@Req() req: Request
	): Observable<any> {
		console.log(req['user'], 'USER#');
		dto.register = req['user'].login_type;
		dto.user_id = req['user']._id;
		return this.EventProxy.send({ cmd: 'eventRefresh' }, dto);
	}
	// -------------------ITEM----------------------
	// 이벤트 아이템 등록 (아이템명,아이템 효과,아이템 가격,사용여부)!
	@Post('eventItemRegistration')
	operator_eventItemRegistration(
		@Body('item_reg_dto', RequiredValidationPipe, IsNotEmptyPipe) dto: Item,
		@Req() req: Request
	): Observable<Item> {
		console.log(req['user'], 'USER');
		dto.register = req['user'].login_type;
		dto.regist_id = req['user']._id;
		return this.EventProxy.send({ cmd: 'eventItemRegistration' }, dto);
	}

	// 아이템 수정
	@Patch('eventItemModify')
	operator_itemModify(
		@Body('item_mod_dto', RequiredValidationPipe, IsNotEmptyPipe)
		org: {
			item_id: string;
			item_name?: string;
			item_type?: string;
			use_yn?: boolean;
			modifier?: string;
			modify_id?: string;
		},
		@Req() req: Request
	): Observable<Item> {
		org.modifier = req['user'].login_type;
		org.modify_id = req['user']._id;
		return this.EventProxy.send({ cmd: 'eventItemModify' }, org);
	}

	// 이벤트 아이템 리스트 (아이템명,아이템 효과,아이템 가격,사용여부)!
	@Get('eventItemList')
	operator_eventItemList(
		@Query('page', new DefaultValuePipe(1)) page: number,
		@Query('limit', new DefaultValuePipe(10)) limit: number,
		@Query('limit', new DefaultValuePipe(-1)) sort: string
	): Observable<Item[]> {
		return this.EventProxy.send({ cmd: 'eventItemList' }, { page, limit, sort });
	}

	// -------------------REWARD----------------------
	// 이벤트 보상 정보 등록 (이벤트정보,아이템 정보,획득일시,사용여부)!
	@Post('eventRewardRegistration')
	operator_eventRewardRegistration(
		@Body('reward_reg_dto', RequiredValidationPipe, IsNotEmptyPipe)
		dto: EventReward,
		@Req() req: Request
	): Observable<EventReward> {
		dto.register = req['user'].login_type;
		dto.regist_id = req['user']._id;
		return this.EventProxy.send({ cmd: 'eventRewardRegistration' }, dto);
	}
	// 이벤트 보상에 아이템정보 삽입
	@Patch('eventRewardModify')
	operator_eventRewardItemSet(
		@Body('reward_mod_dto', RequiredValidationPipe, IsNotEmptyPipe)
		org: {
			reward_id: string;
			reward_round?: string;
			item_id?: string;
			reward_count?: number;
			use_yn?: boolean;
			modifier?: string;
			modify_id?: string;
		},
		@Req() req: Request
	): Observable<EventReward> {
		org.modifier = req['user'].login_type;
		org.modify_id = req['user']._id;
		return this.EventProxy.send({ cmd: 'eventRewardModify' }, org);
	}
	// 이벤트 보상 리스트 (이벤트정보,아이템 정보,보상 아이템 갯수,획득일시,사용여부)!
	@Get('eventRewardList')
	operator_eventRewardList(
		@Query('page', new DefaultValuePipe(1)) page: number,
		@Query('limit', new DefaultValuePipe(10)) limit: number,
		@Query('limit', new DefaultValuePipe(-1)) sort: string
	): Observable<EventReward[]> {
		return this.EventProxy.send({ cmd: 'eventRewardList' }, { page, limit, sort });
	}

	// -------------------PROVIDE----------------------
	// 이벤트 획득 조건 등록 (행위)
	@Post('eventProvideActionRegistration')
	operator_eventProvideActionRegistration(
		@Body('action_reg_dto', RequiredValidationPipe, IsNotEmptyPipe)
		dto: Provide,
		@Req() req: Request
	): Observable<Provide> {
		dto.register = req['user'].login_type;
		dto.regist_id = req['user']._id;
		return this.EventProxy.send({ cmd: 'eventProvideActionRegistration' }, dto);
	}

	// 이벤트 획득 조건 리스트 (행위)
	@Get('eventProvideActionList')
	operator_eventProvideActionList(
		@Query('page', new DefaultValuePipe(1)) page: number,
		@Query('limit', new DefaultValuePipe(10)) limit: number,
		@Query('limit', new DefaultValuePipe(-1)) sort: string
	): Observable<Provide[]> {
		return this.EventProxy.send({ cmd: 'eventProvideActionList' }, { page, limit, sort });
	}

	// 이벤트 획득 조건 사용안함처리
	@Patch('eventProvideActionModify')
	operator_eventProvideActionModify(
		@Body('action_mod_dto', RequiredValidationPipe, IsNotEmptyPipe)
		org: {
			provide_id: string;
			action?: string;
			reward_id?: string;
			use_yn?: boolean;
			modifier?: string;
			modify_id?: string;
		},
		@Req() req: Request
	): Observable<Provide> {
		org.modifier = req['user'].login_type;
		org.modify_id = req['user']._id;
		return this.EventProxy.send({ cmd: 'eventProvideActionModify' }, org);
	}

	// ------------------EVENT----------------------
	// 이벤트 등록 (시작일시,종료일시,  보상정보, 활성/비활성 정보)!
	@Post('eventRegistration')
	operator_eventRegistration(
		@Body('event_reg_dto', RequiredValidationPipe, IsNotEmptyPipe)
		dto: Event,
		@Req() req: Request
	): Observable<Event> {
		dto.register = req['user'].login_type;
		dto.regist_id = req['user']._id;
		return this.EventProxy.send({ cmd: 'eventRegistration' }, dto);
	}

	// 이벤트 수정 (시작일시,종료일시,  보상정보, 활성/비활성 정보)!
	@Patch('eventModify')
	operator_eventModify(
		@Body('event_mod_dto', RequiredValidationPipe, IsNotEmptyPipe)
		org: {
			event_id: string;
			event_name?: string;
			start_date?: Date;
			end_date?: Date;
			provide_id?: string;
			use_yn?: boolean;
			modifier?: string;
			modify_id?: string;
		},
		@Req() req: Request
	): Observable<Event> {
		org.modifier = req['user'].login_type;
		org.modify_id = req['user']._id;
		return this.EventProxy.send({ cmd: 'eventModify' }, org);
	}

	// 이벤트 리스트 (시작일시,종료일시, 보상 획득 조건, 보상정보, 활성/비활성 정보) TODO
	@Get('eventList')
	operator_eventList(
		@Query('page', new DefaultValuePipe(1)) page: number,
		@Query('limit', new DefaultValuePipe(10)) limit: number,
		@Query('limit', new DefaultValuePipe(-1)) sort: string
	): Observable<Event[]> {
		return this.EventProxy.send({ cmd: 'eventList' }, { page, limit, sort });
	}
	/**
	 * 권한 : AUDITOR & OPERATOR
	 * 보상 이력 조회
	 */
	// 보상 지급
	@Post('eventProvideRequest')
	operator_eventProvideRequest(
		@Body('provide_request_dto')
		org: {
			history_id?: string;
			user_id?: string;
			event_id?: string;
		},
		@Req() req: Request
	): Observable<any> {
		org['request_user_id'] = req['user']._id;
		org['login_type'] = req['user'].login_type;
		return this.EventProxy.send({ cmd: 'eventProvideRequest' }, org);
	}
	/**
	 * 권한 : AUDITOR & OPERATOR
	 * 보상 이력 조회
	 */
	// 요청 조회
	@Get('eventHistoryList')
	auditor_eventHistoryList(
		@Query('page', new DefaultValuePipe(1)) page: number,
		@Query('limit', new DefaultValuePipe(10)) limit: number,
		@Query('limit', new DefaultValuePipe(-1)) sort: string
	): Observable<any> {
		return this.EventProxy.send({ cmd: 'eventHistoryList' }, { page, limit, sort });
	}
}
