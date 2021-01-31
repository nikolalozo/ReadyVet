import { MedicalRecordStatusType } from "../enum/medicalExamination.status";

export interface IMedicalHistoryGetQuery { 
    _animal?: string;
    _veterinarian?: string;
    status?: MedicalRecordStatusType;
}