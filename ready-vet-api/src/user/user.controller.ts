import { Controller, Get, Query, Post, Put, Body, Param, Delete, UseInterceptors, UploadedFile } from "@nestjs/common";
import { UserService } from "./user.service";
import { IUser } from "./interfaces/user.interface";
import { GetUsersQueryDto } from "./dto/get.users.query.dto";
import { RegisterUserDto } from "../auth/dto/register.user.dto";
import { UserUpdateDto } from "./dto/user.update.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { editFileName, imageFileFilter } from "../image-service/file-upload.utils";

@Controller('/users')
export class UserController {
  constructor (
    private readonly userService: UserService
  ) {}

  @Get('/')
  async getAll (
    @Query() query: GetUsersQueryDto
  ): Promise<{data: Array<any>, total: number}> {
      return this.userService.getAll(query);
  }
  
  @Post('/')
  async createUser (
    @Body() body: RegisterUserDto
  ): Promise<IUser> {
      return this.userService.createUser(body);
  }

  @Get('/get-users-last-week')
  async getUsersInLastWeek (): Promise<{ datasets: number[], labels: string[] }> {
    return this.userService.getUsersInLastWeek();
  }

  @Get('/:_id')
  async getUserById (
    @Param('_id') _id: string
  ): Promise<IUser> {
      return this.userService.findById(_id);
  }

  @Put('/:_id')
  async updateUser (
    @Param('_id') _id: string,
    @Body() body: UserUpdateDto
  ): Promise<IUser> {
      return this.userService.update(_id, body);
  }

  @Put('/:_id/change-photo')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './users-photos',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  async changeUserPhoto (
    @Param('_id') _id: string,
    @UploadedFile() image
  ): Promise<IUser> {
      return this.userService.changePhoto(_id, image);
  }

  @Delete('/:_id')
  async deleteUser (
      @Param('_id') _id: string,
  ): Promise<{ success: boolean }> {
      return this.userService.delete(_id);
  }
}