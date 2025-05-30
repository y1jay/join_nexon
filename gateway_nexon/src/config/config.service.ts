import { Transport } from '@nestjs/microservices';

export class ConfigService {
	private readonly env_config: { [key: string]: any } = {};

	constructor() {
		// 게이트웨이 포트
		this.env_config.port = process.env.PORT || 3000;
		// auth 서비스 정보
		this.env_config.auth_service = {
			name: process.env.AUTH_SERVICE_NAME, // 서비스 명
			transport: Transport.TCP, // 전송 제어 프로토콜
			options: { host: process.env.AUTH_SERVICE_HOST, port: process.env.AUTH_SERVICE_PORT },
		};
		// event 서비스 정보
		this.env_config.event_service = {
			name: process.env.EVENT_SERVICE_NAME, // 서비스 명
			transport: Transport.TCP, // 전송 제어 프로토콜
			options: { host: process.env.EVENT_SERVICE_HOST, port: process.env.EVENT_SERVICE_PORT },
		};
	}

	get(key: string): any {
		return this.env_config[key];
	}
}
