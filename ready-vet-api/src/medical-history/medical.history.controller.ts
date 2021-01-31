import { Controller, Post, Body, Get, Query, Param, Put, Delete } from "@nestjs/common";
import { MedicalHistoryCreateDto } from "./dto/medical.history.create.dto";
import { GetQueryMedicalHistoryDto } from "./dto/get.query.medical.history.dto";
import { MedicalHistoryUpdateDto } from "./dto/medical.history.update.dto";
import { GetAllMedHistoryByServiceDto } from "./dto/query.medical.history.dto";
import { MedicalHistoryService } from "./medical.history.service";
import { IMedicalHistory } from "./interfaces/medical.history.interface";
import { GetMedicalHistoriesByAnimalsDto } from "./dto/get.medical.histories.by.animals.dto";


@Controller('/medical-records')
export class MedicalHistoryController {
  constructor(
    private readonly medicalHistoryService: MedicalHistoryService
  ) { }

  @Get('/')
  async getAllMedicalRecords(
    @Query() query: GetQueryMedicalHistoryDto
  ): Promise<{ data: Array<IMedicalHistory>, total: number }> {
    return this.medicalHistoryService.getAll(query);
  }

  @Post('/')
  async createMedicalHistory(
    @Body() body: MedicalHistoryCreateDto
  ): Promise<IMedicalHistory> {
    return this.medicalHistoryService.create(body);
  }

  @Get('/get-examinations-last-week')
  async getExaminationsInLastWeek (): Promise<{ datasets: number[], labels: string[] }> {
    return this.medicalHistoryService.getExaminationsInLastWeek();
  }

  @Post('/get-all-by-animal-ids')
  async getMedicalHistories(
    @Body() body: GetMedicalHistoriesByAnimalsDto
  ): Promise<{ data: Array<IMedicalHistory>, total: number }> {
    return this.medicalHistoryService.getMedHistoriesById(body);
  }

  @Get('/by-service')
  async getByServiceId(
    @Query() query: GetAllMedHistoryByServiceDto,
  ): Promise<IMedicalHistory> {
    return this.medicalHistoryService.getByServiceId(query);
  }


  @Get('/:_id')
  async getMedHistoryById(
    @Param('_id') _id: string
  ): Promise<IMedicalHistory> {
    return this.medicalHistoryService.getById(_id);
  }


  @Put('/:_id')
  async updateMedicalHistory(
    @Param('_id') _id: string,
    @Body() body: MedicalHistoryUpdateDto
  ): Promise<IMedicalHistory> {
    return this.medicalHistoryService.update(_id, body);
  }

  @Delete('/:_id')
  async deleteMedicalHistory(
    @Param('_id') _id: string
  ): Promise<{ success: boolean }> {
    return this.medicalHistoryService.delete(_id);
  }
}