import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

// 이벤트 정보
export class Event {
	@IsNotEmpty()
	@IsString()
	@Length(2, 15)
	event_name: string;

	// 시작일시
	@IsNotEmpty()
	@IsDate()
	start_date: Date;

	// 종료일시
	@IsNotEmpty()
	@IsDate()
	end_date: Date;

	// 보상 행위
	@IsString()
	provide_id?: string;

	// 사용 여부
	@IsNotEmpty()
	@IsBoolean()
	use_yn: boolean;

	// 등록자
	@IsNotEmpty()
	@IsString()
	register: string;

	// 등록자 ID
	@IsNotEmpty()
	@IsString()
	regist_id: string;

	// 등록일
	@IsNotEmpty()
	@IsString()
	@IsDate()
	regist_date: Date;

	// 수정자
	@IsString()
	modifier?: string;

	// 수정자 ID
	@IsString()
	modify_id?: string;

	// 수정일
	@IsDate()
	modify_date?: Date;
}
// 지급 정보
export class EventReward {
	// 보상 명
	@IsNotEmpty()
	@IsString()
	@Length(2, 15)
	reward_name: string;

	// 아이템 aud
	@IsNotEmpty()
	@IsString()
	@Length(2, 15)
	item_id: string;

	// 아이템 갯수
	@IsNotEmpty()
	@IsNumber()
	reward_count: number;

	// 등록자 타입
	@IsNotEmpty()
	@IsString()
	register: string;

	// 등록자 ID
	@IsNotEmpty()
	@IsString()
	regist_id: string;

	// 등록일
	@IsNotEmpty()
	@IsString()
	regist_date: Date;

	// 수정자
	@IsString()
	modifier?: string;

	// 수정자id
	@IsString()
	modify_id?: string;

	// 수정일
	@IsDate()
	modify_date?: Date;

	// 활성 비활성 여부
	@IsNotEmpty()
	@IsBoolean()
	use_yn: boolean;
}
export class Provide {
	// 지급 조건 행위 [랜덤형,문제형,혼합형]
	@IsNotEmpty()
	@IsString()
	action: string;

	// 리워드 아이디
	@IsNotEmpty()
	@IsString()
	reward_id: string;

	// 보상 단계
	@IsNotEmpty()
	@IsNumber()
	provide_round: number;

	// 지급 조건 사용 여부
	@IsNotEmpty()
	@IsBoolean()
	use_yn: boolean;

	// 등록자
	@IsNotEmpty()
	@IsString()
	register: string;

	// 등록자id
	@IsNotEmpty()
	@IsString()
	regist_id: string;

	// 등록일
	@IsNotEmpty()
	@IsDate()
	regist_date: Date;

	// 수정자
	@IsString()
	modifier?: string;

	// 수정자id
	@IsString()
	modify_id?: string;

	// 수정일
	@IsDate()
	modify_date?: Date;
}
export class Item {
	// 아이템 명
	@IsNotEmpty()
	@IsString()
	@Length(2, 15)
	item_name: string;

	// 아이템 타입
	@IsNotEmpty()
	@IsString()
	item_type: string;

	// 아이템 효과
	@IsNotEmpty()
	@IsString()
	item_effect: string;

	// 아이템 사용가능여부
	@IsNotEmpty()
	@IsBoolean()
	use_yn: boolean;

	// 아이템 등록타입
	@IsNotEmpty()
	@IsString()
	register: string;

	// 아이템 등록자
	@IsNotEmpty()
	@IsString()
	regist_id: string;

	// 아이템 등록일
	@IsNotEmpty()
	@IsDate()
	regist_date: Date;

	// 아이템 수정자
	@IsString()
	modifier?: string;

	// 아이템 수정자id
	@IsString()
	modify_id?: string;

	// 아이템 수정일
	@IsDate()
	modify_date?: Date;
}
