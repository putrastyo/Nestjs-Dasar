import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma/prisma.service';
import { Logger } from 'winston';

@Injectable()
export class UserRepository {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {
    console.info('Create user repository');
  }

  async save(firstname: string, lastname: string): Promise<User> {
    this.logger.info(`Create user with ${firstname} and ${lastname}`);
    return this.prismaService.user.create({
      data: {
        firstname,
        lastname,
      },
    });
  }
}
