import { Transport } from '@nestjs/microservices';

export class ConfigService {
	private readonly env_config: { [key: string]: any } = {};

	constructor() {
		this.env_config.port = process.env.PORT || 3000;
		this.env_config.auth_service = {
			name: process.env.AUTH_SERVICE_NAME,
			transport: Transport.TCP,
			options: { host: process.env.AUTH_SERVICE_HOST, port: process.env.AUTH_SERVICE_PORT }
		};
		this.env_config.event_service = {
			name: process.env.EVENT_SERVICE_NAME,
			transport: Transport.TCP,
			options: { host: process.env.EVENT_SERVICE_HOST, port: process.env.EVENT_SERVICE_PORT }
		}

	}

	get(key: string): any {
		return this.env_config[key];
	}
}