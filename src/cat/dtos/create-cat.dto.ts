// create-cat.dto.ts

import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateCatDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsNumber()
    readonly age: number;

    @IsNotEmpty()
    @IsString()
    readonly breed: string;
}
