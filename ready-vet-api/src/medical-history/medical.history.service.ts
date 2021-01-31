import { Injectable, UnprocessableEntityException, forwardRef, Inject } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, QueryPopulateOptions } from "mongoose";
import { get, isEmpty } from 'lodash';
import { IMedicalHistory } from "./interfaces/medical.history.interface";
import { IMedicalHistoryCreate } from "./interfaces/medical.history.create.interface"
import { IMedicalHistoryUpdate } from "./interfaces/medical.history.update.interface";
import { IGetAllMedHistoryByService } from "./interfaces/get.all.medical.history.by.service.interface";
import { MedicalRecordStatusType } from "./enum/medicalExamination.status";
import { TimeScheduleService } from "../time-schedule/time.schedule.service";
import { RealtimeService } from "../realtime/realtime.service";
import { AnimalService } from "../animal/animal.service";
import { UserService } from "../user/user.service";
import { IGetMedicalHistoriesByAnimals } from "./interfaces/get.medical.histories.by.animals.interface";
import moment = require("moment");

@Injectable()
export class MedicalHistoryService {
  private readonly populateArray: Array<QueryPopulateOptions> = [
    { path: '_animal', select: 'name animalType animalBreed _petOwner' },
    { path: '_service', select: 'title' },
    { path: '_veterinarian', select: 'name surname' }
  ];
  constructor(
    @InjectModel('MedicalHistory')
    private readonly medicalHistoryModel: Model<IMedicalHistory>,
    private readonly timeScheduleService: TimeScheduleService,
    @Inject(forwardRef(() => RealtimeService))
    private readonly realTimeService: RealtimeService,
    @Inject(forwardRef(() => AnimalService))
    private readonly animalService: AnimalService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) { }

  async getAll(query): Promise<{ data: Array<IMedicalHistory>, total: number }> {
    const { page, limit, sort, search } = query;
    let where: any;
    if (get(query, '_animal')) {
      where = {
        _animal: get(query, '_animal')
      }
    }

    if (get(query, '_veterinarian')) {
      where = {
        ...where,
        _veterinarian: get(query, '_veterinarian')
      }
    }

    if (get(query, 'status')) {
      where = {
        ...where,
        status: get(query, 'status')
      }
    }

    if (search) {
      const searchRegExp = this.escapeRegExp(search);

      where = {
        ...where,
        title: searchRegExp
      };
    }

    const [data, total] = await Promise.all([
      this.medicalHistoryModel.find(where)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(sort || '-createdAt')
        .populate(this.populateArray)
        .lean(),
      this.medicalHistoryModel.find(where).countDocuments()
    ]);

    for (let record of data) {
      let _id;
      let user;
      if (get(record, '_animal')) {
        const animal = get(record, '_animal');
        _id = get(animal, '_petOwner');
        user = await this.userService.findById(_id);
        Object.assign(animal, { ...animal, _petOwner: user });
        Object.assign(record, { ...record, _animal: animal })
      } else {
        _id = get(record, '_petOwner');
        user = await this.userService.findById(_id);
        Object.assign(record, { ...record, _petOwner: user });
      }
      const _medicalRecord = get(record, '_id');
      const timeSchedule = await this.timeScheduleService.getOne(_medicalRecord);
      Object.assign(record, { ...record, date: get(timeSchedule, 'date') });
    }

    return { data: data as any, total };
  }

  async getExaminationsInLastWeek(): Promise<{ datasets: number[], labels: string[] }> {
    const where = {
      createdAt: {
        $gte: moment().startOf('day').subtract(6, 'day').toDate(),
        $lte: moment().toDate()
      },
      status: MedicalRecordStatusType.DONE
    };

    const groupedData = await this.medicalHistoryModel.aggregate([{
      $match: where
    }, {
      $group: {
        _id: {
          dayOfMonth: { $dayOfMonth: '$updatedAt' }
        },
        recordsCount: { $sum: 1 }
      }
    }]);

    const datasets = [];
    const labels = [];

    for (const date = moment().startOf('day').subtract(6, 'days'); date.isSameOrBefore(new Date(), 'day'); date.add(1, 'day')) {
      const monthNumber = parseInt(date.format('D'), 10);
      const monthData = groupedData.find(data => parseInt(data._id.dayOfMonth, 10) === monthNumber);
      datasets.push(monthData ? monthData.recordsCount : 0);
      labels.push(date.format('DD/MM/YYYY'));
    }
    return { datasets, labels };
  }

  async getMedHistoriesById(data: IGetMedicalHistoriesByAnimals): Promise<{ data: Array<IMedicalHistory>, total: number }> {
    const { _animals } = data;
    let medicalRecords: Array<IMedicalHistory> = [];
    if(get(data, '_animals') && !isEmpty(get(data, '_animals'))) {
    for (let animal of _animals) {
      let medRecordsForAnimal = await this.getByAnimalId(animal);
      medRecordsForAnimal.data.forEach(el => {
        medicalRecords.push(el);
      })
    }
  }

    if (get(data, '_petOwner')) {
      const medRecordsWithoutAnimalRecord: Array<IMedicalHistory> = await this.medicalHistoryModel.find({ _petOwner: get(data, '_petOwner'), status: { "$nin": [ MedicalRecordStatusType.DONE, MedicalRecordStatusType.REJECTED_CLIENT] } }).populate(this.populateArray).lean();
      medRecordsWithoutAnimalRecord.forEach(el => {
        medicalRecords.push(el);
      })
    }

    for (let record of medicalRecords) {
      const _medicalRecord = get(record, '_id');
      const timeSchedule = await this.timeScheduleService.getOne(_medicalRecord);
      Object.assign(record, { ...record, date: get(timeSchedule, 'date') });
    }

    return { data: medicalRecords, total: medicalRecords.length };
  }

  async getById(_id: string): Promise<IMedicalHistory> {
    if (!_id) { throw new UnprocessableEntityException('ID not found'); }
    return this.medicalHistoryModel.findById({ _id }).populate(this.populateArray).lean();
  }

  async getNumOfRecordsForVet(_veterinarian: string): Promise<number> {
    const total = await this.medicalHistoryModel.find({ _veterinarian, status: MedicalRecordStatusType.DONE }).countDocuments();
    return total;
  }

  async getByServiceId(data: IGetAllMedHistoryByService): Promise<IMedicalHistory> {
    const { _service } = data;
    if (!_service) { throw new UnprocessableEntityException('Service ID not found'); }
    return this.medicalHistoryModel.findOne({ _service }).lean();
  }

  async getByAnimalId(id: string): Promise<{ data: Array<IMedicalHistory> }> {
    let medHistories: Array<IMedicalHistory> = [];
    medHistories = await this.medicalHistoryModel.find({
      _animal: id,
      status: { "$nin": [ MedicalRecordStatusType.DONE, MedicalRecordStatusType.REJECTED_CLIENT] }
    }).populate(this.populateArray).lean();
    return { data: medHistories };
  }

  async create(data: IMedicalHistoryCreate): Promise<IMedicalHistory> {
    let newMedicalHistory;
    let _petOwner;
    let animal;
    if (get(data, '_animal')) {
      newMedicalHistory = new this.medicalHistoryModel({
        _animal: data._animal,
        _veterinarian: data._veterinarian,
        _service: data._service,
        status: data.status
      });
      const _id = data._animal;
      animal = await this.animalService.getOne(_id);
      _petOwner = get(animal, '_petOwner');
    } else {
      newMedicalHistory = new this.medicalHistoryModel({
        _petOwner: data._petOwner,
        _veterinarian: data._veterinarian,
        _service: data._service,
        status: data.status
      });
      _petOwner = get(data, '_petOwner');
    }
    const newMedHistory = await newMedicalHistory.save().then(newMedicalHistory.populate(this.populateArray).execPopulate());
    await this.timeScheduleService.create({ _medicalRecord: newMedHistory._id, date: data.date });
    let petOwner;
    if (_petOwner) {
      const _id = _petOwner;
      petOwner = await this.userService.findById(_id);
    }
    console.log('newMed', newMedicalHistory);
    await this.realTimeService.sendNewReservation(data._veterinarian, {...data, _id: get(newMedHistory, '_id'), _service: get(newMedHistory, '_service'), _animal: get(newMedHistory, '_animal'), _petOwner: { _id: get(petOwner, '_id'), name: get(petOwner, 'name'), surname: get(petOwner, 'surname') }});
    return newMedHistory;
  }

  async update(_id: string, data: IMedicalHistoryUpdate): Promise<IMedicalHistory> {
    let medHistory = await this.medicalHistoryModel.findById(_id).populate(this.populateArray);
    if (!medHistory) { throw new UnprocessableEntityException('Medical history not exists'); }
    
    if (get(data, '_animal')) {
      await this.medicalHistoryModel.updateOne({ _id },
        { $set: { _animal: get(data, '_animal') } });
    } else if (get(data, 'status') && get(data, 'price')) {
      await this.medicalHistoryModel.updateOne({ _id },
        { $set: { 
          status: get(data, 'status'),
          description: get(data, 'description'),
          medicines: get(data, 'medicines') || '',
          price: get(data, 'price')
        } });
    } else if (get(data, 'status')) {
      await this.medicalHistoryModel.updateOne({ _id },
        { $set: { status: get(data, 'status') } });
    } 
    if (get(data, 'status') && get(data, 'status') === MedicalRecordStatusType.CONFIRMED_VET) {
      await this.realTimeService.confirmedByVet(get(medHistory, '_animal') ? get(medHistory, '_animal._petOwner') : get(medHistory, '_petOwner'), { _veterinarian: get(medHistory, '_veterinarian'), _id: get(medHistory, '_id') });
    } else if (get(data, 'status') && get(data, 'status') === MedicalRecordStatusType.REJECTED_VET) {
      await this.realTimeService.rejectedByVet(get(medHistory, '_animal') ? get(medHistory, '_animal._petOwner') : get(medHistory, '_petOwner'), { _veterinarian: get(medHistory, '_veterinarian'), _id: get(medHistory, '_id') });
    }
    return medHistory;
  }

  async delete(_id: string): Promise<{ success: boolean }> {
    await this.medicalHistoryModel.findByIdAndDelete({ _id });
    return { success: true };
  }

  private escapeRegExp(text: string): RegExp {
    return new RegExp(text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
  }
}
