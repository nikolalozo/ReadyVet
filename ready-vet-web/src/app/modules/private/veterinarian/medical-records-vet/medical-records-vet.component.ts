import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimalService } from '../../../shared/services/animal.service';

@Component({
  selector: 'app-medical-records-vet',
  templateUrl: './medical-records-vet.component.html',
  styleUrls: ['./medical-records-vet.component.css']
})
export class MedicalRecordsVetComponent implements OnInit {
  public animals = [];
  public animalsTotal: number;
  public where = {
    sort: '-createdAt',
    limit: 6,
    page: 1,
    search: ''
  };
  constructor(
    private readonly router: Router,
    private readonly animalService: AnimalService
  ) { }

  ngOnInit(): void {
    this.getAnimals();
  }

  getAnimals() {
    this.animalService.getAllAnimals(this.where)
    .subscribe(res => {
      this.animals = res.data;
      this.animalsTotal = res.total;
    });
  }

  goToAnimalProfile(id: string) {
    this.router.navigate(['/veterinarian/animals', id]);
  }
}
