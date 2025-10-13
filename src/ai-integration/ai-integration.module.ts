import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AiIntegrationService } from './ai-integration.service';
import { AiIntegrationController } from './ai-integration.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AiInteraction, AiInteractionSchema } from './schemas/ai.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: AiInteraction.name, schema: AiInteractionSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_ACCESS_TOKEN_SECRET ,
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION },
    }),
  ],

  providers: [AiIntegrationService],
  controllers: [AiIntegrationController],
  exports: [AiIntegrationService],
})
export class AiIntegrationModule {}
