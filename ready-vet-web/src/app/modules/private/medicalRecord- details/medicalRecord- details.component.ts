import { Output, Component, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { get } from 'lodash';
import * as jsPDF from 'jspdf';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SessionService } from '../../shared/services/session.service';

@Component({
    selector: 'app-medical-record-details',
    templateUrl: './medicalRecord- details.component.html',
    styleUrls: ['./medicalRecord- details.component.css']
})
export class MedicalRecordDetailsComponent {
    @ViewChild('content') content: ElementRef;
    @Output() action = new EventEmitter();
    public title: string;
    public description: string;
    public medicines: string;
    public price: number;
    public animalBreed: string;
    public veterinarian: string;
    public animalType: string;
    public confirmColor: string;
    public confirmBtnName: string;
    constructor(
        public bsModalRef: BsModalService,
        public sessionService: SessionService
    ) { }

    decline() {
        this.bsModalRef.hide(1);
        this.action.emit(false);
        this.removeOverflowHack();
    }

    removeOverflowHack() {
        if (document.body.classList.contains('modal-open')) {
            document.body.classList.remove('modal-open');
        }
    }

    downloadPdf() {
        const doc = new jsPDF();

        const specialElementHandlers = {
            // tslint:disable-next-line:arrow-return-shorthand
            '#editor': (element, renderer) => { return true; }
        };

        const content = this.content.nativeElement;

        doc.fromHTML(content, 15, 15, {
            width: 198,
            elementHandlers: specialElementHandlers
        });

        doc.save('Pregled.pdf');
    }
}
