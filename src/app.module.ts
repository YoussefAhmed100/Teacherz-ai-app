/* eslint-disable @typescript-eslint/require-await */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConversationModule } from './conversation/conversation.module';

@Module({
  imports: [
    //  ConfigModule with validation
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().uri().required(),
        MONGO_DB_NAME: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().default('1h'),
      }),
    }),
       ThrottlerModule.forRoot([{
      ttl:5* 1000,
      limit: 5,
    }]),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGO_URI');
        const dbName = configService.get<string>('MONGO_DB_NAME');

        //  enable listeners

        return {
          uri,
          dbName,
          retryWrites: true,
          w: 'majority',
        };
      },
    }),
    UsersModule,
    AuthModule,
    ConversationModule,
  ],
})
export class AppModule {}
