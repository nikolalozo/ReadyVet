import { Injectable, UnprocessableEntityException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IService } from "./interfaces/service.interface";
import { IServiceCreate } from "./interfaces/service.input.interface";
import { IServiceUpdate } from "src/animal/interfaces/service.update.interface";

@Injectable()
export class ServiceService {
  constructor(
    @InjectModel('Service')
    private readonly serviceModel: Model<IService>
  ) { }

  async getAll(query): Promise<{ data: Array<IService>, total: number }> {
    const { page, limit, sort, search } = query;

    let where: any = {

    };

    if (search) {
      const searchRegExp = this.escapeRegExp(search);

      where = {
        ...where,
        title: searchRegExp
      };
    }

    const [data, total] = await Promise.all([
      this.serviceModel.find(where)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort(sort || '-createdAt')
        .lean(),
      this.serviceModel.find(where).countDocuments()
    ]);
    return { data: data as any, total };
  }

  async getById(_id: string): Promise<IService> {
    return this.serviceModel.findById({ _id }).lean();
  }

  async create(data: IServiceCreate): Promise<IService> {
    const newService = new this.serviceModel({
      ...data
    });

    return newService.save();
  }

  async update(_id: string, data: IServiceUpdate): Promise<IService> {
    let service = await this.serviceModel.findById({ _id });
    if (!service) { throw new UnprocessableEntityException('Service not exists'); }
    service = Object.assign(service, data);

    Object.assign(service, { ...service });

    return service.save();
  }

  async delete(_id: string): Promise<{ success: boolean }> {
    const service = await this.serviceModel.findById({ _id });
    if (!service) { throw new UnprocessableEntityException('Service not found'); }

    await this.serviceModel.deleteOne({ _id });
    return { success: true };
  }

  private escapeRegExp(text: string): RegExp {
    return new RegExp(text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
  }

}
