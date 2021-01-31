import { Injectable, UnprocessableEntityException, Inject, forwardRef } from "@nestjs/common";
import { Model, QueryPopulateOptions } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { get, isEmpty } from 'lodash';
import { IFeedback } from "./interfaces/feedback.interface";
import { IFeedbackCreate } from "./interfaces/feedback.create.interface";
import { MedicalHistoryService } from "../medical-history/medical.history.service";
import { AnimalService } from "../animal/animal.service";
import { UserService } from "../user/user.service";
import { IGetFeedbackByRecordIds } from "./interfaces/get.feedback.by.record.ids.interface";

@Injectable()
export class FeedbackService {
  private readonly populateArray: Array<QueryPopulateOptions> = [
    { path: '_medicalRecord', select: '_animal _veterinarian' }
  ];
  constructor (
    @InjectModel('Feedback')
    private readonly feedbackModel: Model<IFeedback>,
    private readonly medicalHistoryService: MedicalHistoryService,
    private readonly animalService: AnimalService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService    
  ) {}

  async getAll (query): Promise<{data: Array<IFeedback>, total: number}> {
    const { page, limit, sort, search, ...restParams } = query;

    let where: any = {
      ...(restParams || {})
    };

    if (search) {
      const searchRegExp = this.escapeRegExp(search);

      where = {
        ...where,
        name: searchRegExp
      };
    }
  
    const [ data, total ] = await Promise.all([
      this.feedbackModel.find(where)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(sort || '-createdAt')
        .populate(this.populateArray)
        .lean(),
      this.feedbackModel.find(where).countDocuments()
    ]);

    for (let feedback of data) {
      const medicalRecord = get(feedback, '_medicalRecord');
      let newMedicalRecord;
      let _id;
      if (get(medicalRecord, '_animal')) {
        _id = get(medicalRecord, '_animal');
        const animal = await this.animalService.getOne(_id);
        newMedicalRecord = { ...medicalRecord, _petOwner: get(animal, '_petOwner') };
      } else {
        _id = get(medicalRecord, '_petOwner')
        const user = await this.userService.findById(_id);
        newMedicalRecord = { ...medicalRecord, _petOwner: user };
      }
      Object.assign(feedback, { ...feedback, _medicalRecord: newMedicalRecord });
    }

    return { data: data as any, total };
  }

  async findByRecordIds(body: IGetFeedbackByRecordIds): Promise<{ data: Array<IFeedback>, total: number }> {
    if (get(body, '_records') && !isEmpty(get(body, '_records'))) {
      const { _records } = body;
      let where: any = {
        _medicalRecord: { "$in": _records }
      };
      const [ data, total ] = await Promise.all([
        this.feedbackModel.find(where).lean(),
        this.feedbackModel.find(where).countDocuments()
      ]);
      return { data: data as any, total };
    }
    return { data: [], total: 0 };
  }

  async createFeedback(data: IFeedbackCreate): Promise<IFeedback> {
    const medicalRecord = await this.medicalHistoryService.getById(data._medicalRecord);

    if (!medicalRecord) { 
      throw new UnprocessableEntityException('Medical record not found');
    }

    const feedback = new this.feedbackModel({
      ...data
    });

    return feedback.save();
  }

  async findById (_id: string): Promise<IFeedback> {
    const feedback: IFeedback = await this.feedbackModel.findOne({ _id }).lean();

    if (!feedback) { throw new UnprocessableEntityException('Feedback not exists'); }

    return feedback;
  }

  async delete (_id: string): Promise<{success: boolean}> {
    const feedback = await this.feedbackModel.findById(_id);

    if (!feedback) { throw new UnprocessableEntityException('Feedback not found'); }

    await this.feedbackModel.deleteOne({ _id });

    return { success: true };
  }

  private escapeRegExp (text: string): RegExp {
    return new RegExp(text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
  }
}