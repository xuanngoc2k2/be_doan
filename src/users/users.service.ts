import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ObjectId, Repository } from 'typeorm';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs'
import { Request } from 'express';
import { IUser } from './users.interface';
import * as bcrypt from 'bcryptjs';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }


  getHashPassword = (plaintext: string) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(plaintext, salt);
    return hash;
  }

  // async getInfo(user: IUser){
  //   const user = await this.userRepo.findOne({where: {id: }})
  // }
  async register(userDTO: CreateUserDto): Promise<User | { id: number, username: string, success: false, message: string }> {
    if (await this.userRepo.findOne({ where: { username: userDTO.username } })) {
      throw new BadRequestException("Username đã tồn tại !!");
    }
    else if (await this.userRepo.findOne({ where: { email: userDTO.email } })) {
      throw new BadRequestException("Email đã tồn tại !!");
    }
    else if (userDTO.phone_number !== "" && await this.userRepo.findOne({ where: { phone_number: userDTO.phone_number } })) {
      throw new BadRequestException("Số điện thoại đã tồn tại !!");
    }

    const hashPassword = this.getHashPassword(userDTO.password);
    const { password, ...userData } = userDTO;
    const newUser = this.userRepo.create({ password: hashPassword, ...userData });
    return await this.userRepo.save(newUser);
  }

  async findAll() {
    const rs = await this.userRepo.find({});
    const result = rs.map((r) => {
      const { password, ...a } = r;
      return { ...a }
    })
    return result
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
    return bcrypt.compareSync(password, hash);
  }

  updatePass = async (pass: string, newPass: string, user: IUser) => {
    const userF = await this.userRepo.findOne({ where: { id: user.id } })
    if (!userF) {
      throw new BadRequestException("Không tìm thấy user");
    }
    if (!this.isValidPassword(pass, userF.password)) {
      return {
        success: false,
        message: 'Mật khẩu cũ không đúng'
      }
    }
    const updatePass = await this.userRepo.update({ id: user.id }, { password: this.getHashPassword(newPass) })
    if (updatePass.affected == 1) {
      return {
        success: true,
        message: "Cập nhật mật khẩu thành công"
      }
    }
    return {
      success: true,
      message: "Cập nhật mật khẩu lỗi"
    }
  }
  async update(id: number, user: User) {
    const userU = await this.userRepo.findOne({ where: { id } })
    if (userU) {
      const upd = await this.userRepo.update({ id }, { ...user });
      if (upd.affected == 0) {
        return { success: false }
      }
      else {
        return { success: true }
      }
    }
    return { success: false }

  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  updateRefreshToken = async (refreshToken: string, id: number) => {
    return await this.userRepo.update({ id }, { refreshToken });
  }

  updateLevel = async (level: number, idUser) => {
    const user = await this.userRepo.findOne({ where: { id: idUser } });
    if (level > user.level) {
      return await this.userRepo.update({ id: idUser }, { level: (level + 1) })
    }
    return
  }
}
