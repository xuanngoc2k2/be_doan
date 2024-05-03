import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import * as fs from 'fs';
import { diskStorage } from "multer";
import * as path from 'path';

// import path, { join } from "path";
@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    getRootPath = () => {
        return process.cwd();
    }
    ensureExists(targetDirectory: string) {
        fs.mkdir(targetDirectory, { recursive: true }, (error) => {
            if (!error) {
                console.log('Directory successfully created, or it already exists');
                return;
            }
            switch (error.code) {
                case 'EEXIST':
                    //Error:
                    //Requested location already exists, but it's not a dirrectory.
                    break;
                case 'ENOTDIR':
                    //Error
                    //The parent hierarchy contains a file with the same name as the dir
                    break;
                default:
                    console.log(error);
                    break;
            }
        });
    }
    createMulterOptions(): MulterModuleOptions {
        return {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const folder = req?.headers?.folder_type ?? "default";
                    if (folder.includes('video')) {
                        this.ensureExists(`public/${folder}`)
                        cb(null, path.join(this.getRootPath(), `public/${folder}`))
                    }
                    else if (folder.includes('audio')) {
                        this.ensureExists(`public/${folder}`)
                        cb(null, path.join(this.getRootPath(), `public/${folder}`))
                    }
                    else {
                        this.ensureExists(`public/images/${folder}`);
                        cb(null, path.join(this.getRootPath(), `public/images/${folder}`))
                    }

                },
                filename: (req, file, cb) => {
                    let extName = path.extname(file.originalname);
                    let baseName = path.basename(file.originalname, extName);
                    let finalName = `${baseName}-${Date.now()}${extName}`;
                    cb(null, finalName);
                }
            }),
            fileFilter: (req, file, cb) => {
                const folder = req?.headers?.folder_type ?? "default";
                if (folder.includes('video')) {
                    const allowedFileTypes = ['mp4', 'avi', 'mov'];
                    const fileExtension = file.originalname.split('.').pop().toLocaleLowerCase();
                    const isValidFileType = allowedFileTypes.includes(fileExtension);
                    if (!isValidFileType) {
                        cb(new HttpException('File không đúng định dạng', HttpStatus.UNPROCESSABLE_ENTITY), null);
                    }
                    else {
                        cb(null, true)
                    }
                }
                else if (folder.includes('audio')) {
                    const allowedFileTypes = ['mp3'];
                    const fileExtension = file.originalname.split('.').pop().toLocaleLowerCase();
                    const isValidFileType = allowedFileTypes.includes(fileExtension);
                    if (!isValidFileType) {
                        cb(new HttpException('File không đúng định dạng', HttpStatus.UNPROCESSABLE_ENTITY), null);
                    }
                    else {
                        cb(null, true)
                    }
                }
                else {
                    const allowedFileTypes = ['jpg', 'jpeg', 'png', 'gif'];
                    const fileExtension = file.originalname.split('.').pop().toLocaleLowerCase();
                    const isValidFileType = allowedFileTypes.includes(fileExtension);
                    if (!isValidFileType) {
                        cb(new HttpException('File không đúng định dạng', HttpStatus.UNPROCESSABLE_ENTITY), null);
                    }
                    else {
                        cb(null, true)
                    }
                }
            },
            limits: {
                fieldSize: 1024 * 1024 * 500
            }
        };
    }
}