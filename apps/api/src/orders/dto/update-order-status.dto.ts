import { IsEnum } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, {
    message:
      'Status pesanan harus salah satu dari: PENDING, CONFIRMED, PROCESSING, SHIPPED, COMPLETED, CANCELLED',
  })
  status: OrderStatus;
}
