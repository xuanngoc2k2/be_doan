import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs'
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

  async create(username: string, password: string) {
    const hashPassword = this.getHashPassword(password);
    let newUser = this.userRepo.create({ username, password: hashPassword });
    return await this.userRepo.save(newUser);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  findOneByUsername(username: string) {
    return this.userRepo.findOne({ where: { username } });
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }


  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
