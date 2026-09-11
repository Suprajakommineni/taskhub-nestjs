import { IsString, MinLength, Matches } from 'class-validator';

export class CompleteInviteDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
    message:
      'Password must include an uppercase letter, a number, and a special character',
  })
  password: string;
}
