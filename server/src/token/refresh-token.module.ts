import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_REFRESH_TOKEN_EXPIRE'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class RefreshTokenModule {}
