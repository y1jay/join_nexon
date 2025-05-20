import { Body, Controller, Get, Inject, Patch, Post, Query, Req, Res, DefaultValuePipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { IsNotEmptyPipe, RequiredValidationPipe } from 'src/pipe/custom.pipe';

import { EventReward, Provide, Event, Item } from 'src/dto/eventDto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
	@ApiOperation({ summary: '진행중인 이벤트 조회(USER)' })
	@ApiQuery({
		name: 'page',
		type: 'number',
		required: false,
		description: '페이지 번호',
	})
	@ApiQuery({
		name: 'limit',
		type: 'string',
		required: false,
		description: '가져올 갯수',
	})
	@ApiQuery({
		name: 'sort',
		type: 'number',
		required: true,
		description: '기본값 -1(DESC)',
	})
	@ApiResponse({
		schema: {
			type: 'object',
			properties: {
				_id: { example: '이벤트 고유번호' },
				event_name: { example: '이벤트명' },
				start_date: { example: '이벤트 시작일' },
				end_date: { example: '이벤트 종료일' },
				use_yn: { example: '이벤트 진행여부 (true만 나옴)' },
				register: { example: '등록자' },
				regist_id: { example: '등록자 고유번호' },
				regist_date: { example: '등록일' },
				modifier: { example: '수정자' },
				modify_id: { example: '수정자 고유아이디' },
				modify_date: { example: '수정일' },
			},
		},
	})
	user_activeEvent(
		@Query('page', new DefaultValuePipe(1)) page: number,
		@Query('limit', new DefaultValuePipe(10)) limit: number,
		@Query('limit', new DefaultValuePipe(-1)) sort: string
	): Observable<Event[]> {
		return this.EventProxy.send({ cmd: 'activeEvent' }, { page, limit, sort });
	}
	// 요청 조회(유저용)
	@Get('userEventHistoryList')
	@ApiOperation({ summary: '유저 보상 요청 조회(USER)' })
	@ApiQuery({
		name: 'page',
		type: 'number',
		required: false,
		description: '페이지 번호',
	})
	@ApiQuery({
		name: 'limit',
		type: 'string',
		required: false,
		description: '가져올 갯수',
	})
	@ApiQuery({
		name: 'sort',
		type: 'number',
		required: true,
		description: '기본값 -1(DESC)',
	})
	@ApiResponse({
		schema: {
			type: 'object',
			properties: {
				_id: { example: '이벤트 고유번호' },
				event_name: { example: '이벤트명' },
				start_date: { example: '이벤트 시작일' },
				end_date: { example: '이벤트 종료일' },
				use_yn: { example: '이벤트 진행여부 (true만 나옴)' },
				register: { example: '등록자' },
				regist_id: { example: '등록자 고유번호' },
				regist_date: { example: '등록일' },
				modifier: { example: '수정자' },
				modify_id: { example: '수정자 고유아이디' },
				modify_date: { example: '수정일' },
			},
		},
	})
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
	@ApiOperation({ summary: '이벤트 실행 1차 (문제 제출)(USER)' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				event_access_dto: {
					type: 'object',
					properties: {
						event_id: { example: '이벤트 고유번호' },
					},
				},
			},
		},
	})
	@ApiResponse({
		schema: {
			type: 'object',
			properties: {
				statusCode: { example: '상태코드 (200:성공)' },
				message: { example: '문제 : 스페인의 국가는 가사가 없다.' },
			},
		},
	})
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
	@ApiOperation({ summary: '이벤트 실행 2차 (문제 맞추기)(USER)' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				event_refresh_dto: {
					type: 'object',
					properties: {
						answer: { example: '해당 파라미터 없을경우 문제 다시 보여줌' },
					},
				},
			},
		},
	})
	@ApiResponse({
		schema: {
			type: 'object',
			properties: {
				statusCode: { example: '상태코드 (200:성공)' },
				message: { example: '메세지' },
			},
		},
	})
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
	@ApiOperation({ summary: '아이템 등록(OPERATOR)' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				item_reg_dto: {
					type: 'object',
					properties: {
						item_name: { example: '아이템 명' },
						item_type: { example: '아이템 타입' },
						item_effect: { example: '아이템 효과' },
						use_yn: { example: '사용 여부' },
						item_count: { example: '아이템 갯수' },
					},
				},
			},
		},
	})
	@ApiResponse({
		schema: {
			type: 'object',
			properties: {
				statusCode: { example: '상태코드 (200:성공 400:실패)' },
				message: { example: '메세지' },
				data: {
					properties: {
						reward_id: { example: '지급 정보' },
						item_name: { example: '아이템 명' },
						item_type: { example: '아이템 타입' },
						item_effect: { example: '아이템 효과' },
						item_count: { example: '아이템 갯수' },
						use_yn: { example: '사용여부' },
						register: { example: '등록자' },
						regist_id: { example: '등록자 고유번호' },
						regist_date: { example: '등록일' },
						modifier: { example: '수정자' },
						modify_id: { example: '수정자 고유아이디' },
						modify_date: { example: '수정일' },
					},
				},
			},
		},
	})
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
	@ApiOperation({ summary: '이벤트 아이템 리스트(OPERATOR)' })
	@ApiQuery({
		name: 'page',
		type: 'number',
		required: false,
		description: '페이지 번호',
	})
	@ApiQuery({
		name: 'limit',
		type: 'string',
		required: false,
		description: '가져올 갯수',
	})
	@ApiQuery({
		name: 'sort',
		type: 'number',
		required: true,
		description: '기본값 -1(DESC)',
	})
	@ApiResponse({
		schema: {
			type: 'object',
			properties: {
				data: {
					type: 'array',
					items: {
						properties: {
							_id: { example: '아이템 고유번호' },
							reward_id: { example: '보상 정보' },
							item_name: { example: '아이템 명' },
							item_type: { example: '아이템 타입' },
							item_effect: { example: '아이템 효과' },
							item_count: { example: '아이템 갯수' },
							use_yn: { example: '사용여부' },
							register: { example: '등록자' },
							regist_id: { example: '등록자 고유번호' },
							regist_date: { example: '등록일' },
							modifier: { example: '수정자' },
							modify_id: { example: '수정자 고유번호' },
							modify_date: { example: '수정일' },
						},
					},
				},
			},
		},
	})
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
	@ApiOperation({ summary: '보상정보 등록(OPERATOR)' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				item_reg_dto: {
					type: 'object',
					properties: {
						provide_id: { example: '지급 조건 고유번호' },
						use_yn: { example: '사용여부' },
						reward_name: { example: '지급명' },
					},
				},
			},
		},
	})
	@ApiResponse({
		schema: {
			type: 'object',
			properties: {
				statusCode: { example: '상태코드 (200:성공 400:실패)' },
				message: { example: '메세지' },
				data: {
					properties: {
						reward_name: { example: '지급명' },
						provide_id: { example: '지급 조건 명' },
						use_yn: { example: '사용여부' },
						register: { example: '등록자' },
						regist_id: { example: '등록자 고유번호' },
						regist_date: { example: '등록일' },
						modifier: { example: '수정자' },
						modify_id: { example: '수정자 고유아이디' },
						modify_date: { example: '수정일' },
					},
				},
			},
		},
	})
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
	@ApiOperation({ summary: '이벤트 보상 리스트(OPERATOR)' })
	@ApiQuery({
		name: 'page',
		type: 'number',
		required: false,
		description: '페이지 번호',
	})
	@ApiQuery({
		name: 'limit',
		type: 'string',
		required: false,
		description: '가져올 갯수',
	})
	@ApiQuery({
		name: 'sort',
		type: 'number',
		required: true,
		description: '기본값 -1(DESC)',
	})
	@ApiResponse({
		schema: {
			type: 'object',
			properties: {
				data: {
					type: 'array',
					items: {
						properties: {
							_id: { example: '보상 고유번호' },
							reward_name: { example: '보상 명' },
							provide_id: { example: '지급조건 정보' },
							use_yn: { example: '사용여부' },
							register: { example: '등록자' },
							regist_id: { example: '등록자 고유번호' },
							regist_date: { example: '등록일' },
							modifier: { example: '수정자' },
							modify_id: { example: '수정자 고유번호' },
							modify_date: { example: '수정일' },
						},
					},
				},
			},
		},
	})
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
	@ApiOperation({ summary: '획득조건 등록(OPERATOR)' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				item_reg_dto: {
					type: 'object',
					properties: {
						action: { example: '획득조건(quiz:ox 퀴즈, rand:문답형)' },
						event_id: { example: '이벤트 고유번호' },
						use_yn: { example: '사용여부' },
						provide_round: { example: '획득 조건 라운드' },
					},
				},
			},
		},
	})
	@ApiResponse({
		schema: {
			type: 'object',
			properties: {
				statusCode: { example: '상태코드 (200:성공 400:실패)' },
				message: { example: '메세지' },
				data: {
					properties: {
						action: { example: '획득조건(quiz:ox 퀴즈, rand:문답형)' },
						event_id: { example: '이벤트 고유번호' },
						provide_round: { example: '획득 조건 라운드' },
						use_yn: { example: '사용여부' },
						register: { example: '등록자' },
						regist_id: { example: '등록자 고유번호' },
						regist_date: { example: '등록일' },
						modifier: { example: '수정자' },
						modify_id: { example: '수정자 고유아이디' },
						modify_date: { example: '수정일' },
					},
				},
			},
		},
	})
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
	@ApiOperation({ summary: '이벤트 보상조건 리스트(OPERATOR)' })
	@ApiQuery({
		name: 'page',
		type: 'number',
		required: false,
		description: '페이지 번호',
	})
	@ApiQuery({
		name: 'limit',
		type: 'string',
		required: false,
		description: '가져올 갯수',
	})
	@ApiQuery({
		name: 'sort',
		type: 'number',
		required: true,
		description: '기본값 -1(DESC)',
	})
	@ApiResponse({
		schema: {
			type: 'object',
			properties: {
				data: {
					type: 'array',
					items: {
						properties: {
							_id: { example: '보상 고유번호' },
							action: { example: '보상 조건 명 (quiz:OX퀴즈, rand:답문형 퀴즈)' },
							event_id: { example: '이벤트 고유번호' },
							provide_round: { example: '보상 조건 라운드' },
							use_yn: { example: '사용여부' },
							register: { example: '등록자' },
							regist_id: { example: '등록자 고유번호' },
							regist_date: { example: '등록일' },
							modifier: { example: '수정자' },
							modify_id: { example: '수정자 고유번호' },
							modify_date: { example: '수정일' },
						},
					},
				},
			},
		},
	})
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
	@ApiOperation({ summary: '이벤트 등록(OPERATOR)' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				item_reg_dto: {
					type: 'object',
					properties: {
						event_name: { example: '이벤트명' },
						start_date: { example: '이벤트 시작일' },
						end_date: { example: '이벤트 종료일' },
						use_yn: { example: '이벤트 사용여부' },
						provide_id: { example: '지급 조건 정보' },
					},
				},
			},
		},
	})
	@ApiResponse({
		schema: {
			type: 'object',
			properties: {
				statusCode: { example: '상태코드 (200:성공 400:실패)' },
				message: { example: '메세지' },
				data: {
					properties: {
						event_name: { example: '이벤트명' },
						start_date: { example: '이벤트 시작일' },
						end_date: { example: '이벤트 종료일' },
						use_yn: { example: '사용여부' },
						register: { example: '등록자' },
						regist_id: { example: '등록자 고유번호' },
						regist_date: { example: '등록일' },
						modifier: { example: '수정자' },
						modify_id: { example: '수정자 고유아이디' },
						modify_date: { example: '수정일' },
					},
				},
			},
		},
	})
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

	// 이벤트 리스트 (시작일시,종료일시, 보상 획득 조건, 보상정보, 활성/비활성 정보)
	@Get('eventList')
	@ApiOperation({ summary: '이벤트 리스트(OPERATOR)' })
	@ApiQuery({
		name: 'page',
		type: 'number',
		required: false,
		description: '페이지 번호',
	})
	@ApiQuery({
		name: 'limit',
		type: 'string',
		required: false,
		description: '가져올 갯수',
	})
	@ApiQuery({
		name: 'sort',
		type: 'number',
		required: true,
		description: '기본값 -1(DESC)',
	})
	@ApiResponse({
		schema: {
			type: 'object',
			properties: {
				data: {
					type: 'array',
					items: {
						properties: {
							_id: { example: '이벤트 고유번호' },
							event_name: { example: '이벤트명' },
							start_date: { example: '이벤트 시작일' },
							end_date: { example: '이벤트 종료일' },
							use_yn: { example: '이벤트 진행여부 (true,false)' },
							register: { example: '등록자' },
							regist_id: { example: '등록자 고유번호' },
							regist_date: { example: '등록일' },
							modifier: { example: '수정자' },
							modify_id: { example: '수정자 고유아이디' },
							modify_date: { example: '수정일' },
							state: { example: '종료(use_yn = false도 종료), 진행' },
						},
					},
				},
			},
		},
	})
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
	@ApiOperation({ summary: '보상 지급(OPERATOR)' })
	@ApiBody({
		schema: {
			type: 'object',
			properties: {
				provide_request_dto: {
					type: 'object',
					properties: {
						event_id: { example: '이벤트 고유번호' },
						history_id: { example: '요청 고유번호' },
					},
				},
			},
		},
	})
	@ApiResponse({
		schema: {
			type: 'object',
			properties: {
				data: {
					properties: {
						success: { example: '성공횟수' },
						failed: { example: '실패횟수' },
					},
				},
			},
		},
	})
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
	@ApiOperation({ summary: '이벤트 리스트(AUDITOR & OPERATOR)' })
	@ApiQuery({
		name: 'page',
		type: 'number',
		required: false,
		description: '페이지 번호',
	})
	@ApiQuery({
		name: 'limit',
		type: 'string',
		required: false,
		description: '가져올 갯수',
	})
	@ApiQuery({
		name: 'sort',
		type: 'number',
		required: true,
		description: '기본값 -1(DESC)',
	})
	@ApiResponse({
		schema: {
			type: 'object',
			properties: {
				data: {
					type: 'array',
					items: {
						properties: {
							_id: { example: '요청 고유번호' },
							user_id: { example: '유저 고유번호' },
							event_id: { example: '이벤트 고유번호' },
							mission: { example: '미션 ex) {question:스페인의 국가는 가사가 없다.,result:?}' },
							provide_state: { example: '성공, 실패 여부' },
							register: { example: '등록자' },
							regist_id: { example: '등록자 고유번호' },
							regist_date: { example: '등록일' },
						},
					},
				},
			},
		},
	})
	auditor_eventHistoryList(
		@Query('page', new DefaultValuePipe(1)) page: number,
		@Query('limit', new DefaultValuePipe(10)) limit: number,
		@Query('limit', new DefaultValuePipe(-1)) sort: string
	): Observable<any> {
		return this.EventProxy.send({ cmd: 'eventHistoryList' }, { page, limit, sort });
	}
}
