import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

/**
 * UpdateUserDto — same as CreateUserDto but all fields optional,
 * EXCEPT `role` is omitted here for the self-update path.
 * Admin updates (which can include role) use CreateUserDto directly.
 */
export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['role'] as const),
) {}

/**
 * AdminUpdateUserDto — admins may also update the role field.
 */
export class AdminUpdateUserDto extends PartialType(CreateUserDto) {}
