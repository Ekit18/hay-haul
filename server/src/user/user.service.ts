import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserErrorMessage } from './user-error-message.enum';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    try {
      const user = await this.userRepository.save({
        ...dto,
        isVerified: false,
      });
      return user;
    } catch (error) {
      throw new HttpException(
        UserErrorMessage.FailedToCreateUser,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.id = :id', { id })
        .leftJoinAndSelect('user.token', 'token')
        .leftJoinAndSelect('user.stripeEntry', 'stripeEntry')
        .leftJoinAndSelect(
          'user.productAuctionPaymentsAsBuyer',
          'productAuctionPaymentsAsBuyer',
        )
        .leftJoinAndSelect(
          'user.productAuctionPaymentsAsSeller',
          'productAuctionPaymentsAsSeller',
        )
        .leftJoinAndSelect(
          'productAuctionPaymentsAsBuyer.auction',
          'auctionAsBuyer',
        )
        .leftJoinAndSelect(
          'productAuctionPaymentsAsSeller.auction',
          'auctionAsSeller',
        )
        .getOne();
      return user;
    } catch (error) {
      throw new HttpException(
        UserErrorMessage.FailedToGetUser,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  update(id: string, dto: UpdateUserDto) {
    try {
      return this.userRepository
        .createQueryBuilder('user')
        .update(User)
        .set(dto)
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      throw new HttpException(
        UserErrorMessage.FailedToUpdateUser,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      await this.userRepository
        .createQueryBuilder('user')
        .delete()
        .from(User)
        .where('id = :id', { id })
        .execute();
    } catch (error) {
      throw new HttpException(
        UserErrorMessage.FailedToDeleteUser,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUserByEmail(email: string) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email })
        .leftJoinAndSelect('user.token', 'token')
        .leftJoinAndSelect('user.stripeEntry', 'stripeEntry')
        .getOne();

      return user;
    } catch (error) {
      throw new HttpException(
        UserErrorMessage.FailedToGetUser,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
