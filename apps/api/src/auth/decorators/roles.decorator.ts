import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
/** Decorate a controller or route handler with the roles allowed to access it. */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
