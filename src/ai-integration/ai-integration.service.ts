import { Injectable, HttpException, HttpStatus} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { AiInteraction } from './schemas/ai.schema';

@Injectable()
export class AiIntegrationService {
  private readonly baseUrl = process.env.AI_BASE_URL;
  private readonly apiKey = process.env.AI_API_KEY;

  constructor(
    private readonly http: HttpService,
    private readonly jwtService: JwtService,
    @InjectModel(AiInteraction.name)
    private readonly aiInteractionModel: Model<AiInteraction>,
  ) {}


  async explainPoint(point_title: string, teaching_style: string) {

    const { data } = await firstValueFrom(
      this.http.post(
        `${this.baseUrl}/api/explain-point`,
        { point_title, teaching_style },
        { headers: this.getHeaders() },
      ).pipe(),
    ).catch((error) => {
      throw new HttpException(
        error.response?.data || 'AI API communication failed',
        error.response?.status || HttpStatus.BAD_GATEWAY,
      );
    });

    await this.aiInteractionModel.create({
      actionType: 'explain',
      requestData: { point_title, teaching_style },
      responseData: data,
    });

    return data;
  }

  async generateQuestion(point_title: string, ) {

    const { data } = await firstValueFrom(
      this.http.post(
        `${this.baseUrl}/api/generate-question`,
        { point_title },
        { headers: this.getHeaders() },
      ),
    ).catch((error) => {
      throw new HttpException(
        error.response?.data || 'AI API communication failed',
        error.response?.status || HttpStatus.BAD_GATEWAY,
      );
    });

    await this.aiInteractionModel.create({
      actionType: 'generate',
      requestData: { point_title },
      responseData: data,
    });

    return data;
  }

  async evaluateAnswer(
    point_title: string,
    question_text: string,
    student_answer: string,
   
  ) {
   

    const { data } = await firstValueFrom(
      this.http.post(
        `${this.baseUrl}/api/evaluate-answer`,
        { point_title, question_text, student_answer },
        { headers: this.getHeaders() },
      ),
    ).catch((error) => {
      throw new HttpException(
        error.response?.data || 'AI API communication failed',
        error.response?.status || HttpStatus.BAD_GATEWAY,
      );
    });

    await this.aiInteractionModel.create({
      actionType: 'evaluate',
      requestData: { point_title, question_text, student_answer },
      responseData: data,
    });

    return data;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
    };
  }
}
