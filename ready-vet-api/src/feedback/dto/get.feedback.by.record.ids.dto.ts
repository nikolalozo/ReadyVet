import { IsArray } from 'class-validator';
import { IGetFeedbackByRecordIds } from '../interfaces/get.feedback.by.record.ids.interface';

export class GetFeedbackByRecordIdsDto implements IGetFeedbackByRecordIds {
  @IsArray()
  _records: Array<string>;
}
