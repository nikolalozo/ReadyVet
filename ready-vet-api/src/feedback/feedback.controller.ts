import { Controller, Get, Query, Post, Body, Param, Delete } from "@nestjs/common";
import { FeedbackService } from "./feedback.service";
import { IFeedback } from "./interfaces/feedback.interface";
import { GetFeedbacksQueryDto } from "./dto/get.feedbacks.query.dto";
import { FeedbackCreateDto } from "./dto/feedback.create.dto";
import { GetFeedbackByRecordIdsDto } from "./dto/get.feedback.by.record.ids.dto";


@Controller('/feedbacks')
export class FeedbackController {
  constructor (
    private readonly feedbackService: FeedbackService
  ) {}

  @Get('/')
  async getAll (
    @Query() query: GetFeedbacksQueryDto
  ): Promise<{data: Array<IFeedback>, total: number}> {
      return this.feedbackService.getAll(query);
  }
  
  @Post('/')
  async createFeedback (
    @Body() body: FeedbackCreateDto,
  ): Promise<IFeedback> {
      return this.feedbackService.createFeedback(body);
  }
  
  @Post('/get-feedbacks-by-record-ids')
  async getFeedbacksByRecordIds (
    @Body() body: GetFeedbackByRecordIdsDto
  ): Promise<{data: Array<IFeedback>, total: number}>  {
      return this.feedbackService.findByRecordIds(body);
  }
  
  @Get('/:_id')
  async getFeedbackById (
    @Param('_id') _id: string
  ): Promise<IFeedback> {
      return this.feedbackService.findById(_id);
  }


  @Delete('/:_id')
  async deleteService (
      @Param('_id') _id: string,
  ): Promise<{ success: boolean }> {
      return this.feedbackService.delete(_id);
  }
}