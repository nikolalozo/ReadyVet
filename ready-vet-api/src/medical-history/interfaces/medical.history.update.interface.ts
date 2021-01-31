import {  MedicalRecordStatusType } from "../enum/medicalExamination.status";

export interface IMedicalHistoryUpdate {
    description?: string;
    medicines?: string;
    price?: number;
    _animal?: string;
    status?: MedicalRecordStatusType;
}