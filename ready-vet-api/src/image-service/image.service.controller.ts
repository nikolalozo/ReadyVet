import { Controller, Get, Param, Res } from "@nestjs/common";

@Controller('/images')
export class ImageServiceController {
  constructor () {}

  @Get('/users/:imgpath')
  getUserPhotos(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './users-photos' });
  }

  @Get('/medical-services/:imgpath')
  getMedicalServicesPhotos(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: './medical-services' });
  }
}