import { Injectable, Inject, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, QueryPopulateOptions } from "mongoose";
import { get, isEmpty } from 'lodash';
import * as moment from 'moment';
import { ITimeSchedule } from "./interfaces/time.schedule.interface";
import { ITimeScheduleCreate } from "./interfaces/time.schedule.create.interface";
import { ServiceService } from "../service/service.service";
import { AnimalService } from "../animal/animal.service";
import { UserService } from "../user/user.service";

@Injectable()
export class TimeScheduleService {
  private readonly populateArray: Array<QueryPopulateOptions> = [
    { path: '_medicalRecord', select: '_service _veterinarian status _animal _petOwner' }
  ];
  constructor(
    @InjectModel('TimeSchedule')
    private readonly timeScheduleModel: Model<ITimeSchedule>,
    private readonly serviceService: ServiceService,
    private readonly animalService: AnimalService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) { }

  async getAll(query): Promise<{ data: Array<ITimeSchedule>, total: number }> {
    const { page, limit, date, _veterinarian } = query;
    let where: any;

    if (date) {
      where = {
        date: { "$gte": moment(date).startOf('day').toDate(), "$lt": moment(date).endOf('day').toDate() }
      }
    }
    console.log('date', date);
    console.log('start', moment(date).startOf('day').toDate());
    console.log('end', moment(date).endOf('day').toDate())

    let [data, total] = await Promise.all([
      this.timeScheduleModel.find(where)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort('createdAt')
        .populate(this.populateArray)
        .lean(),
      this.timeScheduleModel.find().countDocuments()
    ]);

    if (get(query, '_veterinarian')) {
      const vetSchedule = [];
      total = 0;
      for (let timeSchedule of data) {
        const medicalRecord = get(timeSchedule, '_medicalRecord');
        const _vet = get(timeSchedule, '_medicalRecord._veterinarian');
        if ((!isEmpty(_veterinarian)) && (_veterinarian.toString() === _vet.toString()) && (((get(timeSchedule, '_medicalRecord.status')) === 'DONE') || (get(timeSchedule, '_medicalRecord.status') === 'RESERVED'))) {
          let newMedRecord;
          if (get(timeSchedule, '_medicalRecord._animal')) {
            const _animal = get(timeSchedule, '_medicalRecord._animal');
            const animal = await this.animalService.getById(null, _animal);
            newMedRecord = { ...medicalRecord, _animal: animal };
          } else {
            const _id = get(timeSchedule, '_medicalRecord._petOwner');
            const petOwner = await this.userService.findById(_id);
            newMedRecord = { ...medicalRecord, _petOwner: petOwner };
          }
          const _id = get(timeSchedule, '_medicalRecord._service');
          const service = await this.serviceService.getById(_id);
          newMedRecord = { ...newMedRecord, _service: service };
          Object.assign(timeSchedule, { ...timeSchedule, _medicalRecord: newMedRecord });
          vetSchedule.push(timeSchedule);
          total += 1;
        }
      }

      data = vetSchedule;
    }

    return { data: data as any, total };
  }

  async getOne(_medicalRecord: string): Promise<ITimeSchedule> {
    let where: any;
    if (_medicalRecord) {
      where = {
        _medicalRecord
      }
    }
    return await this.timeScheduleModel.findOne(where).lean();
  }

  async create(data: ITimeScheduleCreate): Promise<ITimeSchedule> {
    const newTimeSchedule = new this.timeScheduleModel({
      ...data
    });
    return newTimeSchedule.save();
  }

  async delete(_id: string): Promise<{ success: boolean }> {
    await this.timeScheduleModel.findByIdAndDelete({ _id });
    return { success: true };
  }

  async deleteByMedicalRecord(_id: string): Promise<{ success: boolean }> {
    await this.timeScheduleModel.remove({ _medicalRecord: _id}).exec();
    return { success: true };
  }
}
