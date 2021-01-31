import { Controller, Post, Body, Get, Query, Param, Delete } from "@nestjs/common";
import { GetQueryTimeScheduleDto } from "./dto/get.query.time.schedule.dto";
import { ITimeSchedule } from "./interfaces/time.schedule.interface";
import { TimeScheduleCreateDto } from "./dto/time.schedule.create.dto";
import { TimeScheduleService } from "./time.schedule.service";


@Controller('/time-schedule')
export class TimeScheduleController {
  constructor (
    private readonly timeScheduleService: TimeScheduleService
  ) {}

  @Get('/')
  async getAllTimeSchedules (
    @Query() query: GetQueryTimeScheduleDto
  ): Promise<{data: Array<ITimeSchedule>, total : number}> {
      return this.timeScheduleService.getAll(query);
  }
  
  @Post('/')
  async createTimeSchedule (
    @Body() body : TimeScheduleCreateDto
  ):Promise<ITimeSchedule> {
    return this.timeScheduleService.create(body);
  }

  @Delete('/:_id')
  async deleteTimeSchedule (
    @Param('_id') _id : string
  ): Promise<{success: boolean}> {
    return this.timeScheduleService.delete(_id);
  }
}