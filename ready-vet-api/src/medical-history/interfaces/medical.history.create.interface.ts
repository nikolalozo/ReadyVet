import {  MedicalRecordStatusType } from "../enum/medicalExamination.status";

export interface IMedicalHistoryCreate {
    _animal?: string;
    _petOwner?: string;
    _veterinarian : string;
    _service: string;
    description?: string;
    medicines?: string;
    price?: number;
    status: MedicalRecordStatusType;
    date: Date;
}