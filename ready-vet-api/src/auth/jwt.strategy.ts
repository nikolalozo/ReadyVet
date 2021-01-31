import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Strategy, ExtractJwt } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from "../shared/config.service";
import { AuthService } from "./auth.service";
import { IJwtPayloadInterface } from "./interfaces/jwt.payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor (
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    super ({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
      secretOrKey: configService.get('JWT_SECRET')
    });
  }

  async validate(payload: IJwtPayloadInterface) {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}