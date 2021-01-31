import { Controller, Post, Body, Get, Res, Param, UseGuards, Req } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { ConfigService } from "../shared/config.service";
import { RegisterUserDto } from "./dto/register.user.dto";
import { LoginInputDto } from "./dto/login.input.dto";
import { IAuthResponseInterface } from "./interfaces/auth.response.interface";

@Controller('/auth')
export class AuthController {
  constructor (
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Post('/register')
  async register (
    @Body() body: RegisterUserDto
  ): Promise<void> {
    await this.authService.register(body);
  }

  @Post('/login')
  async loginUser (@Body() body: LoginInputDto): Promise<IAuthResponseInterface>  {
    return this.authService.login(body);
  }
  
  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  async getMe (@Req() req) {
    return req.user;
  }

  @Get('/verify-user/:verifyHash')
  async verifyRegisteredUser (
    @Res() res,
    @Param('verifyHash') verifyHash: string
  ): Promise<void> {
    const { success, email } = await this.authService.verifyUser(verifyHash);

    if (success) {
      res.redirect(`${this.configService.get('READY_VET_WEB_URL')}/auth/login?email=${email}`)
    } else {
      res.send(`Verification not valid.`)
    }
  }
}