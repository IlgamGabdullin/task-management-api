import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { Repository, EntityRepository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { UserEntity } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";


@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async signUp(authCredsDto: AuthCredentialsDto): Promise<void> {
    const { username,  password } = authCredsDto;

    // cannot compose docker with bcrypt, so commented it just for now
    // const salt = await bcrypt.genSalt();

    const user = this.create();
    user.username = username;
    user.salt = 'salt';
    // user.password = await this.hashPassword(password, user.salt);
    user.password = password;

    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') { // username duplication
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = authCredentialsDto;

    const user = await this.findOne({username});

    if (user && await user.validatePassword(password)) {
      return user.username
    }

    return null;
  }
 
  // privatд
}