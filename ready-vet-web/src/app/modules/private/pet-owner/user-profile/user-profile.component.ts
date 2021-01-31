import { Component, OnInit } from '@angular/core';
import { get } from 'lodash';
import { Router, ActivatedRoute } from '@angular/router';
import { faDog, faLaptopMedical } from '@fortawesome/free-solid-svg-icons';
import { IUser } from '../../../shared/interfaces/interface';
import { SessionService } from 'src/app/modules/shared/services/session.service';
import { AnimalService } from '../../../shared/services/animal.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  public readonly faDog = faDog;
  public readonly faLaptopMedical = faLaptopMedical;
  public user: IUser;
  public isAdmin = false;
  public animals = [];
  public animalsTotal: number;
  public where = {
    sort: '-createdAt',
    limit: 3,
    page: 1,
    search: '',
    _petOwner: ''
  };
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly sessionService: SessionService,
    private readonly animalService: AnimalService
    ) { }

  ngOnInit(): void {
    this.user = this.sessionService.user;
    this.where._petOwner = get(this.user, '_id');
    if (get(this.user, 'role') === 'ADMIN') {
      this.isAdmin = true;
      this.where._petOwner =  get(this.route, 'snapshot.params._id');
    }
    this.getAnimals();
  }

  getAnimals(page?) {
    this.animalService.getAllAnimals({ ...this.where, page: page || this.where.page })
    .subscribe(res => {
      this.animals = res.data;
      this.animalsTotal = res.total;
    });
  }

  goToAnimalProfile(id: string) {
    if (this.isAdmin) {
      this.router.navigate(['/veterinarian/animals', id]);
    } else {
      this.router.navigate(['/pet-owner', 'animals', id]);
    }
  }
}
