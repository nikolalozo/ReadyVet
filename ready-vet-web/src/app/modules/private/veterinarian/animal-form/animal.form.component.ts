import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { AnimalType } from '../../../shared/enum/animal.type.enum';
import { AnimalGenderType } from '../../../shared/enum/animal.gender.type.enum';
import { UserService } from '../../../shared/services/user.service';
import { AnimalService } from '../../../shared/services/animal.service';
import { get, isEmpty } from 'lodash';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: './animal.form.component.html',
  styleUrls: ['./animal.form.component.css']
})
export class AnimalFormComponent implements OnInit {
  public readonly faSearch = faSearch;
  private subcription: Subscription;
  public petOwners = [];
  private _medicalRecord: string;
  public selectedPetOwner = {
    email: '',
    name: '',
    surname: ''
  };
  public data = {
    animalType: AnimalType.MACKA,
    gender: AnimalGenderType.ZENKA,
    age: 0,
    weight: 0,
    animalBreed: '',
    sicknesses: '',
    _petOwner: ''
  };
  public where = {
    sort: '-createdAt',
    limit: 6,
    page: 1,
    search: '',
    role: 'ANIMAL_OWNER'
  };
  public genders = [ 'ZENKA', 'MUZJAK' ];
  public animalTypes = [ 'MACKA', 'PAS', 'ZEC' ];

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly animalService: AnimalService,
    private readonly userService: UserService,
    private readonly notifier: NotifierService
  ) { }

  ngOnInit(): void {
    this.subcription = this.route
    .queryParams
    .subscribe(params => {
      this._medicalRecord = get(params, '_medicalRecord');
    });
  }

  create(): void {
    this.animalService.saveAnimal({...this.data, _medicalRecord: this._medicalRecord })
    .subscribe(res => {
      const newAnimal = res;
      this.notifier.notify('success', 'Nova zivotinja je dodata u bazu');
      this.router.navigate(['/veterinarian/animals', get(newAnimal, '_id'), 'add-medical-examination', this._medicalRecord]);
    }, error => {
      this.notifier.notify('error', 'Nije moguce dodati novu zivotnju u bazu');
    });
  }

  getPetOwners() {
    this.userService.getAllUsers(this.where)
    .subscribe(res => {
      this.petOwners = res.data;
    });
  }

  getPetOwnerName(): string {
    if (!isEmpty(this.selectedPetOwner)) {
      return `${this.selectedPetOwner.name} ${this.selectedPetOwner.surname}`;
    } else {
      return '';
    }
  }

  selectPetOwner(petOwner: any) {
    this.data._petOwner = get(petOwner, '_id');
    this.selectedPetOwner = petOwner;
    this.petOwners = [];
  }
}
