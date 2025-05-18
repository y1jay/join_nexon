export class Result<T> {
	statusCode: number;
	message: string;
	error?: string;
	data?: T;
}
