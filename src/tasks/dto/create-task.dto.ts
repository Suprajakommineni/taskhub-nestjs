import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsInt()
  projectId!: number;

  @IsOptional()
  @IsBoolean()
  done?: boolean;
}
