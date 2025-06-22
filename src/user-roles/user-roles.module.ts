import { Module } from '@nestjs/common'
import { UserRolesService } from './user-roles.service'
import { UserRolesController } from './user-roles.controller'
import { PrismaService } from 'src/common/services/prisma.service'

@Module({
  controllers: [UserRolesController],
  exports: [UserRolesService],
  providers: [UserRolesService, PrismaService]
})
export class UserRolesModule {}
