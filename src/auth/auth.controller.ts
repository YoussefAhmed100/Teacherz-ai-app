import { Body, Controller, Post} from '@nestjs/common';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SinupDto } from './dtos/sinup.dto';
import { LoginDto } from './dtos/login.dto';

@ApiTags('Auth') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiBody({ type: SinupDto })
  @ApiResponse({
    status: 201,
    description: 'User signed up successfully',
    schema: {
      example: {
        data: {
          _id: '652f1e5d9c1234567890abcd',
          username: 'ahmed123',
          email: 'ahmed@example.com',
          role: 'student',
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  signup(@Body() dto: SinupDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully',
    schema: {
      example: {
        data: {
          _id: '652f1e5d9c1234567890abcd',
          username: 'ahmed123',
          email: 'ahmed@example.com',
          role: 'student',
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
