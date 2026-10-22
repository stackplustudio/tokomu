/**
 * Representasi user yang sudah ter-autentikasi dari JWT payload.
 * Diisi oleh JwtStrategy.validate() dan disuntikkan via @CurrentUser().
 * Menggunakan class agar kompatibel dengan emitDecoratorMetadata di NestJS.
 */
export class AuthUser {
  id!: string;
  email!: string;
  role!: string;
}
