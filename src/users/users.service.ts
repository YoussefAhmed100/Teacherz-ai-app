/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PasswordService } from 'src/common/services/password.service';
import { User, UserDocument } from './schema/user.schema';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ApiFeatures } from 'src/common/api-features';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private passwordService: PasswordService,
  ) {}

  async findAll(query: any) {
    const countDocuments = await this.userModel.countDocuments();
    const features = new ApiFeatures(this.userModel.find(), query)
      .filter()
      .sort()
      .limitFields()
      .search()
      .paginate(countDocuments);

    const { query: mongooseQuery, pagination } = features.build();
    const users = await mongooseQuery;

    return { results: users.length, pagination, data: users };
  }
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException(`No user found with id ${id}`);
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!updatedUser)
      throw new NotFoundException(`No user found with id ${id}`);
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.userModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException(`No user found with id ${id}`);
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const user = await this.findUserByIdOrThrow(userId);

    await this.passwordService.validate(dto.currentPassword, user.password);
    this.passwordService.ensureMatch(dto.password, dto.confirmPassword);

    user.password = await this.passwordService.hash(dto.password);
    await user.save();
    return { message: 'Password updated successfully' };
  }

  private async findUserByIdOrThrow(userId: string): Promise<UserDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`No user found for this id: ${userId}`);
    }
    return user;
  }
}
