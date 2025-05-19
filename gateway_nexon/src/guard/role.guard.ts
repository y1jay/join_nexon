// role.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
		const user = context.switchToHttp().getRequest()?.user;
		const handler = context.getHandler().name;
		/**
		 * user : 보상 요청 가능
		 * operator : 이벤트/ 보상 등록
		 * auditor : 보상 이력 조회만 가능
		 * admin : 전부 가능
		 */
		// 관리자 전부 성공
		// 로그인, 가입 전부 성공
		console.log(handler, '>>');
		if (user?.login_type == 'admin' || ['join_user', 'login_user'].includes(handler)) {
			return true;
		} else {
			// 등급으로 시작하는 핸들러 여부
			return handler.startsWith(user.login_type);
		}
	}
}

