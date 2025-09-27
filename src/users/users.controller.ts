/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Delete, Param, Body, UseGuards, Query, Patch, Sse } from '@nestjs/common';
import { UserService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/roles.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { interval, Observable} from 'rxjs';
// import { UserResponseDto } from './dtos/userResponse.dto';
// نعرف نوع الحدث عشان NestJS يتعامل معاه


@Controller('users')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly userService: UserService) {}



// @Sse('stream')
// async streamUsers(@Query() query: any): Promise<Observable<{ data: string }>> {
//   const result = await this.userService.findAll(query);
//   const users = result.data;

//   const allText = users.map((u) => JSON.stringify(u)).join(' ');

//   const words = allText.split(' ');

//   return new Observable<{ data: string }>((subscriber) => {
//     let index = 0;

//     const source$ = interval(200).subscribe(() => {
//       if (index < words.length) {
//         subscriber.next({ data: words[index] });
//         index++;
//       } else {
//         subscriber.next({ data: '[DONE]' });
//         subscriber.complete();
//       }
//     });

//     return () => {
//       source$.unsubscribe();
//     };
//   });
// }
@Sse('stream')
async streamUsers(
  @Query('mode') mode: 'word' | 'chunk' = 'chunk', // 🟢 نحدد المود من الكويري
): Promise<Observable<{ data: string }>> {
  const result = await this.userService.findAll({});
  const users = result.data;

  if (mode === 'word') {
    // ✅ Word by Word (زي ChatGPT)
    const allText = users.map((u) => JSON.stringify(u)).join(' ');
    const words = allText.split(' ');

    return new Observable<{ data: string }>((subscriber) => {
      let index = 0;
      const source$ = interval(200).subscribe(() => {
        if (index < words.length) {
          subscriber.next({ data: words[index] });
          index++;
        } else {
          subscriber.next({ data: '[DONE]' });
          subscriber.complete();
        }
      });

      return () => source$.unsubscribe();
    });
  }

  // ✅ Chunk by Chunk (كل User كامل)
  return new Observable<{ data: string }>((subscriber) => {
    let index = 0;
    const source$ = interval(1000).subscribe(() => {
      if (index < users.length) {
        subscriber.next({ data: JSON.stringify(users[index]) });
        index++;
      } else {
        subscriber.next({ data: '[DONE]' });
        subscriber.complete();
      }
    });

    return () => source$.unsubscribe();
  });
}



  // @Get()
  // @Roles(Role.Admin)
  // findAll(@Query() query: any) {
  //   return this.userService.findAll(query);
  // }

  @Get(':id')
  @Roles(Role.Admin)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }


  @Patch(':id/change-password')
  async changePassword(
    @Param('id') id: string,
    @Body() dto: ChangePasswordDto,
  ) {
    return this.userService.changePassword(id, dto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
