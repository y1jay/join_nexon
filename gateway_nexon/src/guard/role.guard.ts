// role.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

// 권한 처리 RolesGuard
@Injectable()
export class RolesGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const user = context.switchToHttp().getRequest()?.user; // 유저 정보
		const handler = context.getHandler().name; // 핸들러 명
		console.log(handler, 'HANDLER');
		/**
		 * user : 보상 요청 가능, 보상요청 이력 조회 , 이벤트 실행
		 * operator : 이벤트/ 보상 등록
		 * auditor : 보상 이력 조회만 가능
		 * admin : 전부 가능
		 */
		// 관리자 전부 성공
		// 로그인, 가입 전부 성공
		console.log(handler.startsWith('auditor'), '>>');
		console.log(handler.startsWith('auditor'), '>>');
		console.log(user?.login_type == 'operator', '###');
		if (
			user?.login_type == 'admin' ||
			['join_user', 'login_user', 'user_activeEvent'].includes(handler) ||
			(user?.login_type == 'operator' && handler.startsWith('auditor'))
		) {
			return true;
		} else {
			// 등급으로 시작하는 핸들러 여부
			return handler.startsWith(user.login_type);
			// user 는 user만
			// operator 는 operator만
			// 이력 조회는 유저 빼고 전부
			// admin 은 전부
		}
	}
}
