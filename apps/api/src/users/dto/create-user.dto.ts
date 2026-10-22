import {
  IsEmail,
  IsString,
  IsOptional,
  MinLength,
  IsEnum,
} from 'class-validator';

// H-5 / L-2 fix: use an explicit enum instead of a free string
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export class CreateUserDto {
  @IsEmail({}, { message: 'Format email tidak valid' })
  email: string;

  @IsOptional()
  @IsString()
  name?: string;

  // C-3 fix: password is required; no silent 'password123' fallback
  @IsString()
  @MinLength(6, { message: 'Password minimal 6 karakter' })
  password: string;

  // H-5 fix: only USER or ADMIN are accepted values
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role harus USER atau ADMIN' })
  role?: UserRole;
}
