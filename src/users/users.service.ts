import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ObjectId, Repository } from 'typeorm';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs'
import { Request } from 'express';
import { IUser } from './users.interface';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }

  getHashPassword = (plaintext: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(plaintext, salt);
    return hash;
  }
  // async getInfo(user: IUser){
  //   const user = await this.userRepo.findOne({where: {id: }})
  // }
  async register(userDTO: CreateUserDto) {
    if (await this.userRepo.findOne({ where: { username: userDTO.username } })) {
      throw new BadRequestException("Username đã tồn tại !!");
    }
    else if (await this.userRepo.findOne({ where: { email: userDTO.email } })) {
      throw new BadRequestException("Email đã tồn tại !!");
    }
    else if (userDTO.phone_number != "" && await this.userRepo.findOne({ where: { phone_number: userDTO.phone_number } })) {
      throw new BadRequestException("Số điện thoại đã tồn tại !!");
    }
    const hashPassword = this.getHashPassword(userDTO.password);
    let { password, ...user } = userDTO;
    let newUser = this.userRepo.create({ password: hashPassword, ...user });
    return await this.userRepo.save(newUser);
  }

  findAll() {
    return this.userRepo.find({});
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    const { password, role, refreshToken, createdAt, ...info } = user;
    return info;
  }

  findOneByUsername(username: string) {
    return this.userRepo.findOne({ where: { username } });
  }

  findUserByToken(refreshToken: string) {
    return this.userRepo.findOne({ where: { refreshToken } });
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }


  update(id: number, user: User) {
    return `This action updates a #${user.username} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  updateRefreshToken = async (refreshToken: string, id: number) => {
    return await this.userRepo.update({ id }, { refreshToken });
  }
}
