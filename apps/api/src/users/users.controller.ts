import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto, AdminUpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthUser } from '../auth/interfaces/auth-user.interface';

// All endpoints in this controller require authentication
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ── ADMIN-only: create a new user ─────────────────────────────────────────
  @Roles('ADMIN')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // ── ADMIN-only: list all users (paginated) ────────────────────────────────
  @Roles('ADMIN')
  @Get()
  findAll(@Query('page') page = '1', @Query('limit') limit = '20') {
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    return this.usersService.findAll(pageNum, limitNum);
  }

  // ── ADMIN or own record: get one user ─────────────────────────────────────
  // H-4 fix: USER can only read their own record; ADMIN can read any
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() currentUser: AuthUser) {
    this.assertSelfOrAdmin(id, currentUser);
    return this.usersService.findOne(id);
  }

  // ── ADMIN: full update (can change role) ──────────────────────────────────
  @Roles('ADMIN')
  @Patch(':id/admin')
  adminUpdate(@Param('id') id: string, @Body() dto: AdminUpdateUserDto) {
    return this.usersService.adminUpdate(id, dto);
  }

  // ── Own record only: self-update (cannot change role) ─────────────────────
  // H-4 fix: USER can only update themselves; ADMIN can update any via /admin
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() currentUser: AuthUser,
  ) {
    this.assertSelfOrAdmin(id, currentUser);
    return this.usersService.update(id, dto);
  }

  // ── ADMIN-only: delete a user ─────────────────────────────────────────────
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // ---------------------------------------------------------------------------
  // Helper: enforce ADMIN or self access
  // ---------------------------------------------------------------------------
  private assertSelfOrAdmin(targetId: string, currentUser: AuthUser): void {
    if (currentUser.role === 'ADMIN') return;
    if (currentUser.id === targetId) return;
    throw new ForbiddenException(
      'Akses ditolak: kamu hanya dapat mengakses data milikmu sendiri',
    );
  }
}
