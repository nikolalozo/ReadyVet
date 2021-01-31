import { Injectable, BadRequestException, UnprocessableEntityException, forwardRef, Inject } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { get, isEmpty } from 'lodash';
import * as fs from 'fs';
import { IUser } from './interfaces/user.interface';
import { IRegisterUserInputData } from "../auth/interfaces/register.user.input.data.interface";
import { UserType } from "./enum/user.type.enum";
import { HashService } from "../shared/hash.service";
import { IUserUpdate } from "./interfaces/user.update.interface";
import { MedicalHistoryService } from "../medical-history/medical.history.service";
import { AuthService } from "../auth/auth.service";
import moment = require("moment");

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private readonly userModel: Model<IUser>,
    private readonly hashService: HashService,
    @Inject(forwardRef(() => MedicalHistoryService))
    private readonly medicalHistoryService: MedicalHistoryService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) { }

  async getAll(query): Promise<{ data: Array<any>, total: number }> {
    const { page, limit, sort, search, role, ...restParams } = query;

    let where: any = {
      ...(restParams || {})
    };

    if (search) {
      const searchRegExp = this.escapeRegExp(search);

      where = {
        ...where,
        email: searchRegExp
      };
    }

    if (role) {
      where = {
        ...where,
        role
      };
    }

    if (get(query, 'verifiedByAdmin')) {
      where = {
        ...where,
        verifiedByAdmin: get(query, 'verifiedByAdmin')
      };
    }

    const [data, total] = await Promise.all([
      this.userModel.find(where)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(sort || '-createdAt')
        .lean(),
      this.userModel.find(where).countDocuments()
    ]);

    if (data && role === 'VETERINARIAN') {
      for (let vet of data) {
        let total = await this.medicalHistoryService.getNumOfRecordsForVet(get(vet, '_id'));
        Object.assign(vet, { ...vet, totalDoneMedRecords: total });
      }
    }

    return { data: data as any, total };
  }

  async createUser(data: IRegisterUserInputData): Promise<IUser> {
    const foundedUser = await this.getByEmail(data.email);

    if (foundedUser && foundedUser.isVerified) {
      throw new BadRequestException('Email is already registered.');
    } else if (foundedUser && !foundedUser.isVerified) {
      foundedUser.remove();
    }

    const user = new this.userModel({
      email: data.email,
      password: await this.hashService.cryptPassword(data.password),
      name: data.name,
      surname: data.surname,
      role: data.role,
      verificationCode: Math.random().toString().slice(2, 8)
    });

    return user.save();
  }

  async getUsersInLastWeek (): Promise<{ datasets: number[], labels: string[] }> {
    const where = {
      createdAt: {
        $gte: moment().startOf('day').subtract(6, 'day').toDate(),
        $lte: moment().toDate()
      }
    };

    const groupedData = await this.userModel.aggregate([{
      $match: where
    }, {
      $group: {
        _id: {
          dayOfMonth: { $dayOfMonth: '$createdAt' }
        },
        userCount: { $sum: 1 }
      }
    }]);

    const datasets = [];
    const labels = [];

    for (const date = moment().startOf('day').subtract(6, 'days'); date.isSameOrBefore(new Date(), 'day'); date.add(1, 'day')) {
      const monthNumber = parseInt(date.format('D'), 10);
      const monthData = groupedData.find(data => parseInt(data._id.dayOfMonth, 10) === monthNumber);
      datasets.push(monthData ? monthData.userCount : 0);
      labels.push(date.format('DD/MM/YYYY'));
    }
    return { datasets, labels };
  }

  async update(_id: string, data: IUserUpdate): Promise<IUser> {
    let user = await this.findById(_id);
    if (!user) { throw new UnprocessableEntityException('User not found'); }

    console.log('data', data);
    if (get(data, 'verifiedByAdmin') && !get(data, 'education')) {
      console.log('AA');
      await this.userModel.updateOne(
        { _id },
        { $set: { verifiedByAdmin: get(data, 'verifiedByAdmin') } }
      );
      user = await this.getByEmail(user.email, true, true);
      await this.authService.generateAndSendEmail(user);
    } else {
      await this.userModel.updateOne(
        { _id },
        { $set: { education: get(data, 'education') } }
      );
    }

    return user;
  }

  async changePhoto(_id: string, image): Promise<IUser> {
    let user = await this.findById(_id);
    if (!user) { throw new UnprocessableEntityException('User not found'); }

    if (image) {
      if (user.image && !isEmpty(get(user, 'image.path'))) {
        fs.unlinkSync(get(user, 'image.path'));
      }
      const { originalname, filename, path } = image;
      await this.userModel.updateOne(
        { _id },
        { $set: { image: { originalname, filename, path } } }
      );
    }
    Object.assign(user, { ...user, image });
    return user;
  }

  async getByEmail(email: string, searchVerifiedAndNotVerified?: boolean, lean?: boolean): Promise<IUser> {
    const query = this.userModel.findOne({
      email,
      ...(!searchVerifiedAndNotVerified ? {
        isVerified: true
      } : {})
    }).select('+verificationCode +password');

    if (!lean) { return query; }

    return query.lean();
  }

  async findByEmail(email: string, password: string): Promise<IUser> {
    if (!email) { throw new BadRequestException('Email is required.'); }

    const user: IUser = await this.getByEmail(email, true, true);

    if (!user) { throw new BadRequestException('Check your credentials!'); }
    // if (user && !user.isVerified) { throw new BadRequestException('Please check your email and verify your account.'); }

    const isValidPassword = await this.hashService.isValidPassword(password, user.password);

    if (!isValidPassword) { throw new BadRequestException('Please, check your credentials!'); }

    return user;
  }

  async findById(_id: string): Promise<IUser> {
    return this.userModel.findOne({ _id }).lean();
  }

  async findAdmin(): Promise<IUser> {
    return this.userModel.findOne({ role: UserType.ADMIN }).lean();
  }

  async getOne(_user: string, role: UserType): Promise<IUser> {
    const user: IUser = await this.userModel.findOne({
      _id: _user,
      role: role
    }).lean();

    if (!user) { throw new UnprocessableEntityException('User not exists'); }

    return user;
  }

  async delete(_id: string): Promise<{ success: boolean }> {
    const user = await this.findById(_id);

    if (!user) { throw new UnprocessableEntityException('User not found'); }

    await this.userModel.deleteOne({ _id });

    return { success: true };
  }

  private escapeRegExp(text: string): RegExp {
    return new RegExp(text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
  }
}