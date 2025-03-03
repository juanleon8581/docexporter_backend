import { prisma } from "@/data/postgres";
import { UserDataSource } from "@/domain/datasources";
import { CreateUserDto, UpdateUserDto } from "@/domain/dtos";
import { UserEntity } from "@/domain/entities";
import { NotFoundError } from "@/errors/not-found-error";

export class UserDatasourceImpl implements UserDataSource {
  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = await prisma.user.create({
      data: createUserDto,
    });

    return UserEntity.fromJson(newUser);
  }

  async getAll(): Promise<UserEntity[]> {
    const users = await prisma.user.findMany();

    return users.map((user) => UserEntity.fromJson(user));
  }

  async getById(id: string): Promise<UserEntity> {
    const user = await prisma.user.findUnique({
      where: {
        id,
        deleted: false,
      },
    });

    if (!user) throw new NotFoundError("user not found");

    return UserEntity.fromJson(user);
  }

  async update(updateDto: UpdateUserDto): Promise<UserEntity> {
    const { id } = updateDto;
    await this.getById(id);

    const userUpdated = await prisma.user.update({
      where: {
        id,
      },
      data: updateDto.values,
    });

    return UserEntity.fromJson(userUpdated);
  }

  async deleteById(id: string): Promise<UserEntity> {
    await this.getById(id);

    const userDeleted = await prisma.user.update({
      where: {
        id,
      },
      data: {
        deleted: true,
        deletedAt: new Date(),
      },
    });

    return UserEntity.fromJson(userDeleted);
  }
}
