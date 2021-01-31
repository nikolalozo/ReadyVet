import { Injectable, UnprocessableEntityException, forwardRef, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { get, isEmpty } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { IRegisterUserInputData } from "./interfaces/register.user.input.data.interface";
import { IAuthResponseInterface } from "./interfaces/auth.response.interface";
import { IUser } from "../user/interfaces/user.interface";
import { IJwtPayloadInterface } from "./interfaces/jwt.payload.interface";
import { UserService } from "../user/user.service";
import { LoginInputDto } from "./dto/login.input.dto";
import { UserType } from "../user/enum/user.type.enum";
import { EncryptionService } from '../shared/encryption.service';
import { EmailService } from '../email/services/email.service';
import { RealtimeService } from "../realtime/realtime.service";

@Injectable()
export class AuthService {
  constructor (
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly encryptionService: EncryptionService,
    private readonly emailService: EmailService,
    @Inject(forwardRef(() => RealtimeService))
    private readonly realTimeService: RealtimeService
  ) {}

  async register (data: IRegisterUserInputData): Promise<void> {
    const user = await this.userService.createUser(data);
    const admin = await this.userService.findAdmin();

    if ((get(data, 'role') === UserType.VETERINARIAN && get(user, 'verifiedByAdmin')) || get(data, 'role') === UserType.ANIMAL_OWNER || get(data, 'role') === UserType.ADMIN) {
      this.realTimeService.newRegistration(admin._id, user);
      this.generateAndSendEmail(user);
    }
  }

  async generateAndSendEmail(user: IUser): Promise<void> {
    const verifyUrl = this.generateVerifyUrl(user.email, user.verificationCode, true);
    try {
      await this.sendUserVerifyEmail(user.email, user.name, verifyUrl);
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log('send email err', err);
    }
  }

  async login (data: LoginInputDto): Promise<IAuthResponseInterface> {
    let token = '';
    if (!data.email || !data.password) { throw new UnprocessableEntityException('Please, enter your email and password'); }
    const user = await this.userService.findByEmail(data.email, data.password);

    if (!isEmpty(user) && user.isVerified) {
      token = this.generateJwtToken(user);
      return {user, token};
    } else {
      throw new UnprocessableEntityException('Email or password not valid')
    }
  }

  async validateUser (payload: IJwtPayloadInterface) {
    return this.userService.findById(payload._id);
  }

  async verifyUser (verifyHash: string): Promise<{ success: boolean, email?: string }> {
    const verifyObjString = this.encryptionService.decrypt(verifyHash);

    let verifyObj = null;

    try {
      verifyObj = JSON.parse(verifyObjString);
    } catch (err) {
      return { success: false };
    }

    const user = await this.userService.getByEmail(verifyObj.email, true);

    if (!user || !user.verificationCode || !verifyObj.code || user.verificationCode !== verifyObj.code) { return { success: false}; }
    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    return { success: true, email: user.email };
  }

  private generateVerifyUrl (email: string, code: string, registration?: boolean): string {
    const baseUrl = this.configService.get('API_BASE_URL');
    return `${baseUrl}/auth/verify-user/${this.encryptionService.encrypt(JSON.stringify({ email, code}))}`
  }

  private generateJwtToken (user: IUser): string {
    return this.jwtService.sign({ _id: user._id }, { expiresIn: '6d'});
  }

  private sendUserVerifyEmail (email: string, name: string, verifyUrl: string): Promise<{success: boolean}> {
    return this.emailService.sendEmail({
      template: 'user-verify',
      to: email,
      subject: 'Please confirm email for your Ready Vet profile',
      context: { name, verifyUrl }
    })
  }

}