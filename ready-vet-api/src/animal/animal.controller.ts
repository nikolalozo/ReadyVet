import { Controller, Post, Body, Get, Param, Query, Put, Delete } from "@nestjs/common";
import { AnimalService } from "./animal.service";
import { IAnimal } from "./interfaces/animal.interface";
import { GetQueryAnimalsDto } from "./dto/get.query.animals.dto";
import { AnimalCreateDto } from "./dto/animal.create.dto";
import { AnimalUpdateDto } from "./dto/animal.update.dto";
import { QueryAnimalsDto } from "./dto/query.animals.dto";

@Controller('/animals')
export class AnimalController {
  constructor (
    private readonly animalService: AnimalService
  ) {}

  @Get('/')
  async getAllAnimals (
    @Query() query: GetQueryAnimalsDto
  ): Promise<{data: Array<IAnimal>, total: number}> {
    return this.animalService.getAll(query);
  }
  
  @Post('/')
  async createAnimal (
    @Body() body: AnimalCreateDto,
  ): Promise<IAnimal> {
    return this.animalService.create(body);
  }

  @Get('/:_animal')
  async getAnimalById (
    @Query() query: QueryAnimalsDto,
    @Param('_animal') _animal: string
  ): Promise<IAnimal> {
    return this.animalService.getById(query, _animal);
  }
  
  @Put('/:_animal')
  async updateAnimal (
    @Param('_animal') _animal: string,
    @Body() body: AnimalUpdateDto
  ): Promise<IAnimal> {
    return this.animalService.update(_animal, body);
  }

  @Delete('/:_animal')
  async deleteAnimal (
    @Query() query: QueryAnimalsDto,
    @Param('_animal') _animal: string,
  ): Promise<{ success: boolean }> {
    return this.animalService.delete(query, _animal);
  }
}
