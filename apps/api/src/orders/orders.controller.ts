import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CheckoutDto } from './dto/checkout.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthUser } from '../auth/interfaces/auth-user.interface';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // ─── Customer: Checkout Keranjang Menjadi Pesanan (FR-33) ───
  @Post()
  checkout(@CurrentUser() user: AuthUser, @Body() checkoutDto: CheckoutDto) {
    return this.ordersService.checkout(user.id, checkoutDto);
  }

  // ─── Customer: Lihat Riwayat Pesanan Sendiri (FR-35) ───
  @Get()
  findUserOrders(@CurrentUser() user: AuthUser) {
    return this.ordersService.findUserOrders(user.id);
  }

  // ─── Admin Only: Lihat Semua Pesanan (FR-37) ───
  // Ditaruh sebelum :id agar tidak tertimpa parameter wildcard
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Get('admin/all')
  findAllOrders(@Query() query: QueryOrderDto) {
    return this.ordersService.findAllOrders(query);
  }

  // ─── Admin Only: Perbarui Status Pesanan (FR-37) ───
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @Patch('admin/:id/status')
  updateOrderStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, dto.status);
  }

  // ─── Customer: Lihat Detail Pesanan Sendiri (FR-35, Cek IDOR) ───
  @Get(':id')
  findUserOrderById(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.ordersService.findUserOrderById(user.id, id);
  }
}
