import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import * as moment from 'moment';
import { UserService } from '../../../shared/services/user.service';
import { UserType } from '../../../shared/enum/user.type.enum';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';
import { SocketIoService } from '../../../shared/services/socket.io.service';
import { MedicalRecordService } from '../../../shared/services/medical.record.service';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.css']
})
export class HomeAdminComponent implements OnInit {
  public unverifiedVets = [];
  public currentPage = 1;
  private subscription: Subscription;
  public where = {
    sort: '-createdAt',
    limit: 15,
    page: 1,
    search: '',
    role: UserType.VETERINARIAN,
    verifiedByAdmin: false
  };
  chartOptions = {
    responsive: true,
    scaleOverride: true,
    scaleStepWidth: 5,
    scaleStartValue: 5,
    scales: {
      yAxes: [{
        ticks: {
          stepSize: 1,
          beginAtZero: true,
        },
      }],
    },
  };
  chartData = [];
  chartLabels = [];
  public colors: Color[] = [{
    backgroundColor: 'rgba(0, 146, 198, 1)',
    borderColor: 'rgba(0, 146, 198, 1)',
    pointBackgroundColor: 'rgba(0, 146, 198, 1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(0, 146, 198, 0.8)'
  }];

  constructor(
    private readonly notifier: NotifierService,
    private readonly userService: UserService,
    private readonly medicalRecordService: MedicalRecordService,
    private readonly socketIoService: SocketIoService
  ) { }

  ngOnInit(): void {
    this.getUnverifiedUsers();
    this.subscription = this.socketIoService.receiveNewRegistration().subscribe(res => {
      this.receivedNewRegistration(res);
    });
    this.getUsersInLastWeek();
    this.getExaminationsInLastWeek();
  }

  getUsersInLastWeek() {
    this.userService.getUsersInLastWeek().subscribe(res => {
      this.chartData.push({ data: res.datasets, label: 'Novi korisnici' });
      this.chartLabels = res.labels;
    });
  }

  getExaminationsInLastWeek() {
    this.medicalRecordService.getExaminationsInLastWeek().subscribe(res => {
      this.chartData.push({ data: res.datasets, label: 'Novi pregledi' });
      this.chartLabels = res.labels;
    });
  }

  getUnverifiedUsers() {
    this.userService.getAllUsers(this.where).subscribe(res => {
      this.unverifiedVets = res.data;
    });
  }

  receivedNewRegistration(data) {
    this.notifier.notify('success', 'Nova registracija od veterinara');
    this.unverifiedVets.push(data);
  }

  getDate(date) {
    return moment(date).format('DD.MM.YYYY');
  }

  calculate(i: number): number {
    if (this.currentPage > 1) {
      return ((this.currentPage - 1) * this.where.limit) + i;
    } else {
      return i;
    }
  }

  approveRegistration(id: string) {
    this.userService.updateUser({ verifiedByAdmin: true, _id: id })
      .subscribe(res => {
        this.getUnverifiedUsers();
        this.notifier.notify('success', 'Zahtev je potvrdjen');
      }, err => {
        this.notifier.notify('error', 'Zahtev ne moze biti potvrdjen');
      });
  }

  rejectRegistration(id: string) {
    this.userService.deleteUser(id).subscribe(res => {
      this.getUnverifiedUsers();
      this.notifier.notify('success', 'Zahtev je odbijen');
    }, err => {
      this.notifier.notify('error', 'Zahtev ne moze biti odbijen');
    });
  }
}
