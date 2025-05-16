export class resultDto<T> {
	statusCode: number;
	message: string;
	error?: string;
	data?: T;
}

