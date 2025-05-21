import { Transport } from '@nestjs/microservices';

export class ConfigService {
	private readonly env_config: { [key: string]: any } = {};

	constructor() {
		this.env_config.service = {
			// 전송 제어 프로토콜
			transport: Transport.TCP,
			// 서버 옵션
			options: {
				host: process.env.HOST,
				port: process.env.PORT,
			},
		};
	}

	get(key: string): any {
		return this.env_config[key];
	}
}

