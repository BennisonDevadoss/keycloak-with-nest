import { MODELS } from './constants';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
      log: ['error', 'info', 'query', 'warn'],
      errorFormat: 'pretty',
    });
  }

  async onModuleInit() {
    await this.$connect();
    await this.main();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
  private async main() {
    this.$use(async (params: any, next: any) => {
      if (MODELS.includes(params.model)) {
        if (params.action == 'delete') {
          params.action = 'update';
          params.args['data'] = { deleted_at: new Date() };
        }
        if (params.action == 'deleteMany') {
          params.action = 'updateMany';
          if (params.args.data != undefined) {
            params.args['data'] = { deleted_at: new Date() };
          } else {
            params.args['data'] = { deleted_at: new Date() };
          }
        }
        if (params.action === 'findUnique' || params.action === 'findFirst') {
          params.action = 'findFirst';
          params.args.where['deleted_at'] = null;
        }
        if (params.action === 'aggregate') {
          if (params.args.where) {
            if (params.args.where.deleted == undefined) {
              params.args.where['deleted_at'] = null;
            }
          } else {
            params.args['where'] = { deleted_at: null };
          }
        }
        if (params.action === 'findMany') {
          if (params.args.where) {
            if (params.args.where.deleted == undefined) {
              params.args.where['deleted_at'] = null;
            }
          } else {
            params.args['where'] = { deleted_at: null };
          }
        }
      }
      return next(params);
    });
  }
}
