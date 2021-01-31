import { Controller, Get, Query, Param, Post, Body, Put, Delete } from "@nestjs/common";
import { ServiceService } from "./service.service";
import { IService } from "./interfaces/service.interface";
import { ServiceCreateDto } from "./dto/service.create.dto";
import { ServiceUpdateDto } from "./dto/service.update.dto";
import { GetQueryServicesDto } from "./dto/get.query.services.dto";

@Controller('/medical-services')
export class ServiceController {
    constructor (
        private readonly serviceService: ServiceService
    ) {}

    @Get('/')
    async getAll (
        @Query() query: GetQueryServicesDto
    ): Promise<{data: Array<IService>, total: number}> {
        return this.serviceService.getAll(query);
    }
    
    @Post('/')
    async createService (
        @Body() body: ServiceCreateDto,
    ): Promise<IService> {
        return this.serviceService.create(body);
    }

    @Get('/:_id')
    async getServiceById (
        @Param('_id') _id: string
    ): Promise<IService> {
        return this.serviceService.getById(_id);
    }

    @Put('/:_id')
    async updateService (
        @Param('_id') _id: string,
        @Body() body: ServiceUpdateDto,
    ): Promise<IService> {
        return this.serviceService.update(_id, body);
    }

    @Delete('/:_id')
    async deleteService (
        @Param('_id') _id:string,
    ): Promise<{ success: boolean }> {
        return this.serviceService.delete(_id);
    }
}