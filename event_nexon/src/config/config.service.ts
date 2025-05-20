import { Transport } from '@nestjs/microservices';

export class ConfigService {
	private readonly env_config: { [key: string]: any } = {};

	constructor() {
		this.env_config.service = {
			transport: Transport.TCP,
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
