import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpException,
  HttpRedirectResponse,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  UseFilters,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';
import { User } from '@prisma/client';
import { ValidationFilter } from 'src/validation/validation.filter';
import {
  LoginUserRequest,
  loginUserRequestValidation,
} from 'src/model/login.model';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { Auth } from 'src/auth/auth.decorator';
import { Roles } from 'src/role/role.decorator';

@Controller('/api/users')
export class UserController {
  // @Inject()
  // private userService: UserService;
  constructor(
    private userService: UserService,
    private connection: Connection,
    private mailService: MailService,
    @Inject('EmailService') private emailService: MailService,
    private userRepository: UserRepository,
    private memberService: MemberService,
  ) {}

  // === Custom Decorator ===
  @Get('/me')
  @Roles(['admin'])
  getMe(@Auth() user: User) {
    return {
      data: `Hello ${user.firstname} ${user.lastname}`,
    };
  }

  // === PIPE ===
  @Post('/login')
  @UseFilters(ValidationFilter)
  // @UseInterceptors(TimeInterceptor)
  @Header('Content-Type', 'application/json')
  login(
    @Body(new ValidationPipe(loginUserRequestValidation))
    request: LoginUserRequest,
  ) {
    return {
      message: `Hello ${request.username} | ${request.password}`,
    };
  }

  // === PRISMA ===
  @Post('/create-user')
  async createUser(
    @Body('firstname') firstname: string,
    @Body('lastname') lastname: string,
  ): Promise<User> {
    if (!firstname) {
      throw new HttpException(
        {
          error: 'Firstname is required',
        },
        400,
      );
    }
    return this.userRepository.save(firstname, lastname);
  }

  // === CUSTOM PROVIDER ===
  @Get('/connection')
  getConnection(): string {
    this.mailService.send();
    this.emailService.send();
    console.log(this.memberService.getConnection());
    this.memberService.sendEmail();
    return this.connection.getName();
  }

  // === DEPENDENCY INJECTION ===
  @Get('/get-name')
  // @UseFilters(ValidationFilter)
  getName(@Query('name') name: string): string {
    return this.userService.getName(name);
  }

  // === COOKIE ===
  @Get('/set-cookie')
  setCookie(@Query('title') title: string, @Res() response: Response) {
    response.cookie('title', title);
    response.send('Cookie created successfuly!');
  }

  @Get('/get-cookie')
  getCookie(@Req() request: Request): string {
    return `Title Cookie: ${request.cookies['title']}`;
  }

  // === VIEW Template Engine ===
  @Get('/view')
  getView(@Query('name') name: string, @Res() response: Response) {
    response.render('index.html', {
      title: 'Template Engine',
      name: name,
    });
  }

  // === HTTP Request ===
  @Get()
  get(@Query('name') name: string, @Query('age') age: number): string {
    return `Nama adalah: ${name || 'anon'}, Umur adalah: ${age || 'nothing'}`;
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number): string {
    return `ID kamu adalah: ${id}`;
  }

  @Post()
  @HttpCode(201)
  async post(
    @Body('nama') nama: string,
    @Body('profesi') profesi: string,
  ): Promise<string> {
    return `Halo ${nama}, you are ${profesi}`;
  }

  @Get('/redirect')
  @Redirect()
  redirect(): HttpRedirectResponse {
    return {
      url: '/api/users?name=redirect',
      statusCode: 301,
    };
  }
}
