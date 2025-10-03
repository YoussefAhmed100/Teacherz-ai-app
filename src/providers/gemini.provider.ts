/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GeminiProvider {
  private readonly GEMINI_API =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

  private readonly API_KEY = process.env.GEMINI_API_KEY;

  constructor(private readonly http: HttpService) {}

  async generateAnswer(
    prompt: string,
    retries = 3,
    delay = 2000,
  ): Promise<string> {
    if (!this.API_KEY) {
      throw new Error('❌ GEMINI_API_KEY not found in environment variables');
    }

    let lastError: any;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await firstValueFrom(
          this.http.post(
            `${this.GEMINI_API}?key=${this.API_KEY}`,
            {
              contents: [{ parts: [{ text: prompt }] }],
            },
            { headers: { 'Content-Type': 'application/json' } },
          ),
        );

        return (
          response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          '❌ No answer generated'
        );
      } catch (error: any) {
        lastError = error;

        // ✅ Retry if overloaded (503)
        if (error.response?.status === 503 && attempt < retries) {
          console.warn(
            `⚠️ Gemini overloaded. Retry ${attempt}/${retries} after ${delay}ms...`,
          );
          await new Promise((res) => setTimeout(res, delay));
          continue;
        }

        throw new HttpException(
          error.response?.data || 'Failed to fetch from Gemini API',
          error.response?.status || 500,
        );
      }
    }

    throw new HttpException(
      lastError?.response?.data || 'Gemini API unavailable after retries',
      lastError?.response?.status || 503,
    );
  }
}
