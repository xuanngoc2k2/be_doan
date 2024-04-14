import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public, ResponseMessage } from 'src/decorator/customize';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Public()
  @Post('upload')
  @ResponseMessage("Upload ảnh")
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile(
    // new ParseFilePipeBuilder()
    //   .addFileTypeValidator({
    //     fileType: /^(jpg|jpeg|png|image\/png|gif)$/i,
    //   })
    //   .addMaxSizeValidator({
    //     maxSize: 10240 * 1024
    //   })
    //   .build({
    //     errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    //   }),
  ) file: Express.Multer.File) {
    return { fileName: file.filename }
  }

  @Get()
  findAll() {
    return this.fileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fileService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.fileService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fileService.remove(+id);
  }
}
