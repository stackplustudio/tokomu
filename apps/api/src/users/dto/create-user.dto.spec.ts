import { validate } from 'class-validator';
import { CreateUserDto, UserRole } from './create-user.dto';
import { plainToInstance } from 'class-transformer';

describe('CreateUserDto Validation Tests (C-3 / H-5 Regression)', () => {
  it('should fail validation when email is invalid', async () => {
    const dto = plainToInstance(CreateUserDto, {
      email: 'not-an-email',
      password: 'validPassword123',
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'email')).toBe(true);
  });

  it('should fail validation when password is shorter than 6 characters', async () => {
    const dto = plainToInstance(CreateUserDto, {
      email: 'valid@stackplus.studio',
      password: '123',
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });

  it('should fail validation when role is not a valid enum value', async () => {
    const dto = plainToInstance(CreateUserDto, {
      email: 'valid@stackplus.studio',
      password: 'validPassword123',
      role: 'SUPERADMIN_HACKER',
    });
    const errors = await validate(dto);
    expect(errors.some((e) => e.property === 'role')).toBe(true);
  });

  it('should pass validation with valid USER role', async () => {
    const dto = plainToInstance(CreateUserDto, {
      email: 'valid@stackplus.studio',
      password: 'validPassword123',
      role: UserRole.USER,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should pass validation with valid ADMIN role', async () => {
    const dto = plainToInstance(CreateUserDto, {
      email: 'valid@stackplus.studio',
      password: 'validPassword123',
      role: UserRole.ADMIN,
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });
});
