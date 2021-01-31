import { Injectable, UnprocessableEntityException, forwardRef, Inject } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { get } from 'lodash';
import { Model, QueryPopulateOptions } from "mongoose";
import { IAnimal } from "./interfaces/animal.interface";
import { UserService } from "../user/user.service";
import { UserType } from "../user/enum/user.type.enum";
import { IAnimalCreate } from "./interfaces/animal.input.interface";
import { IAnimalUpdate } from "./interfaces/animal.update.interface";
import { IQueryAnimals } from "./interfaces/query.animals.interface";
import { MedicalHistoryService } from "../medical-history/medical.history.service";

@Injectable()
export class AnimalService {
  private readonly populateArray: Array<QueryPopulateOptions> = [
    { path: '_petOwner', select: 'name surname image' }
  ];
  constructor (
    @InjectModel('Animal')
    private readonly animalModel: Model<IAnimal>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => MedicalHistoryService))
    private readonly medicalHistoryService: MedicalHistoryService
  ) { }

  async getAll (query): Promise<{data: Array<IAnimal>, total: number}> {
    const { page, limit, sort, search, ...restParams } = query;

    let where: any;
    if (get(query, '_petOwner')) {
      where = {
        ...(restParams || {}),
        _petOwner: get(query, '_petOwner')
      };
    } else {
      where = {
        ...(restParams || {}),
      };
    }

    if (search) {
      const searchRegExp = this.escapeRegExp(search);

      where = {
        ...where,
        animalBreed: searchRegExp
      };
    }

    const [data, total  ] = await Promise.all([
      this.animalModel.find(where)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(sort || '-createdAt')
        .populate(this.populateArray)
        .lean(),
      this.animalModel.find(where).countDocuments()
    ]);

    return { data: data as any, total };
  }

  async getById (data: IQueryAnimals, _id: string): Promise<IAnimal> {
    const _petOwner = get(data, '_petOwner');
    let animal;
    if (!_petOwner) {
      animal = await this.animalModel.findOne({ _id }).populate(this.populateArray).lean();
    } else {
      animal = await this.animalModel.findOne({ _id, _petOwner }).lean();
    }
    return animal;
  }

  async getOne (_id: string): Promise<IAnimal> {
    return this.animalModel.findOne({ _id }).populate(this.populateArray).lean();
  }

  async create (data: IAnimalCreate): Promise<IAnimal> {
    const { _petOwner } = data;
    if (!_petOwner) { throw new UnprocessableEntityException('Pet owner ID not found'); }
    const petOwner = await this.userService.getOne(_petOwner, UserType.ANIMAL_OWNER);

    if (!petOwner) { throw new UnprocessableEntityException('Pet owner not found'); }

    let newAnimal = new this.animalModel({
      _petOwner: petOwner._id,
      ...data
    });

    this.medicalHistoryService.update(get(data, '_medicalRecord'), { _animal: get(newAnimal, '_id') })

    return newAnimal.save();
  }

  async update (_id: string, data: IAnimalUpdate): Promise<IAnimal> {
    const { _petOwner } = data;
    if (!_petOwner) { throw new UnprocessableEntityException('Pet owner ID not found'); }
    const petOwner = await this.userService.getOne(_petOwner, UserType.ANIMAL_OWNER);

    if (!petOwner) { throw new UnprocessableEntityException('Pet owner not found'); }

    let animal = await this.animalModel.findOne({_id, _petOwner});

    if (!animal) { throw new UnprocessableEntityException('Animal not exists'); }

    animal = Object.assign(animal, data);

    return animal.save();
  }

  async delete (data: IQueryAnimals, _id: string): Promise<{success: boolean}> {
    const { _petOwner } = data;
    if (!_petOwner) { throw new UnprocessableEntityException('Pet owner ID not found'); }
    const petOwner = await this.userService.getOne(_petOwner, UserType.ANIMAL_OWNER);

    if (!petOwner) { throw new UnprocessableEntityException('Pet owner not found'); }

    await this.animalModel.deleteOne({ _id, _petOwner });

    return { success: true };
  }

  private escapeRegExp (text: string): RegExp {
    return new RegExp(text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
  }
}