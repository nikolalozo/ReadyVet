import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { get } from 'lodash';
import { NotifierService } from 'angular-notifier';
import { faSearch, faTrash, faUsers } from '@fortawesome/free-solid-svg-icons';
import { UserType } from '../../../shared/enum/user.type.enum';
import { SessionService } from 'src/app/modules/shared/services/session.service';
import { UserService } from 'src/app/modules/shared/services/user.service';
import { AnimalService } from 'src/app/modules/shared/services/animal.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmComponent } from '../../../public/components/confirm/confirm.component';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {
  public readonly faSearch = faSearch;
  public readonly faTrash = faTrash;
  public readonly faUsers = faUsers;
  private bsModalRef: BsModalRef;
  public currentPage = 1;
  public users = [];
  public totalUsers: number;
  public where = {
    sort: '-createdAt',
    limit: 15,
    page: 1,
    search: '',
    role: UserType.ANIMAL_OWNER
  };
  public whereAnimal = {
    sort: '',
    limit: 0,
    page: 1,
    search: ''
  };


  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly notifier: NotifierService,
    private readonly modalService: BsModalService,
    private readonly sessionService: SessionService,
    private readonly animalService: AnimalService
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(page?) {
    this.userService.getAllUsers({ ...this.where, page: page || this.where.page, role: 'ANIMAL_OWNER' })
      .subscribe(result => {
        this.users = result.data;
        this.totalUsers = result.total;
        this.users.forEach(el => {
          Object.assign(el, { ...el, numOfPets: this.getAnimals(get(el, '_id')) });
        });
      });
  }

  goToProfile(id: string) {
    this.router.navigate([`/veterinarian/all-users/user/${id}`]);
  }

  getDate(date) {
    return moment(date).format('DD.MM.YYYY');
  }

  getAnimals(id: string): number {
    let petsTotal = 0;
    if (this.users && this.users[0]) {
      this.animalService.getAllAnimals({ ...this.whereAnimal, _petOwner: id })
        .subscribe(res => {
          petsTotal = res.total;
        });
      return petsTotal;
    }
  }

  removeUser(id: string) {
    this.userService.deleteUser(id).subscribe(res => {
      this.notifier.notify('success', 'Korisnik je uspesno obrisan');
      this.getUsers();
    }, err => {
      this.notifier.notify('error', 'Korisnik nije uspesno obrisan');
    });
  }


  openModal(id: string) {
    const initialState = {
      message: 'Da li stvarno hocete da obrisete korisnika?',
      title: 'Obrisite korisnika'
    };

    this.bsModalRef = this.modalService.show(ConfirmComponent, { initialState });
    this.bsModalRef.content.closeBtnName = 'Odustani';
    this.bsModalRef.content.confirmBtnName = 'Potvrdi';
    this.bsModalRef.content.confirmColor = 'btn-outline-danger';
    this.bsModalRef.content.closeColor = 'btn-outline-primary';

    this.bsModalRef.content.action
      .subscribe((value) => {
        if (value) {
          this.removeUser(id);
        }
        return value;
      }, () => {
        return false;
      });
  }

  calculate(i: number): number {
    if (this.currentPage > 1) {
      return ((this.currentPage - 1) * this.where.limit) + i;
    } else {
      return i;
    }
  }
}
