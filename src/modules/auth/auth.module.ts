import { Global, Module } from '@nestjs/common';

import { CacheModule } from '@/system/cache';

import { AuthController } from './controllers';
import { JwtAuthGuard } from './guards';
import { AuthService } from './services';

@Global()
@Module({
  imports: [CacheModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
