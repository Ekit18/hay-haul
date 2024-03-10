import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateFacilityDetailsDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @IsString()
  @IsNotEmpty()
  readonly code: string;

  @IsArray()
  @IsString({ each: true })
  readonly farmProductTypes?: string[] = [];
}
