import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class RequiredValidationPipe implements PipeTransform {
	async transform(value: any, metadata: ArgumentMetadata) {
		if (!value) {
			throw new BadRequestException(`${metadata?.data} 필수 매개변수가 잘못됐습니다.`);
		}

		return value;
	}
}

export class IsNotEmptyPipe implements PipeTransform {
	async transform(value: any, metadata: ArgumentMetadata) {
		if (value !== undefined) {
			if (typeof value !== 'object') {
				throw new BadRequestException(`${metadata?.data} 매개변수 형식은 JSON 입니다.`);
			}
		}

		return value;
	}
}

@Injectable()
export class SeparatorValidationPipe implements PipeTransform {
	constructor(private readonly userValue: any, private readonly required: boolean = false) {}

	transform(value: string, metadata: ArgumentMetadata) {
		if (this.required === false && value === undefined) return;

		return value.split(this.userValue);
	}
}

@Injectable()
export class PhoneValidationPipe implements PipeTransform {
	constructor(private readonly userValue: any = '', private readonly required: boolean = false) {}

	transform(value: string, metadata: ArgumentMetadata) {
		if (this.required === false && value === undefined) return;

		let regex = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;

		if (this.userValue === '-') {
			regex = /^01([0|1|6|7|8|9])-([0-9]{3,4})-([0-9]{4})$/;
		}

		if (regex.test(value) === false) {
			throw new BadRequestException(
				`${metadata?.data} 매개변수 형식은 01[0|1|6|7|8|9]${this.userValue}[0-9]{3,4}${this.userValue}[0-9]{4} 입니다.`
			);
		}

		return value;
	}
}

