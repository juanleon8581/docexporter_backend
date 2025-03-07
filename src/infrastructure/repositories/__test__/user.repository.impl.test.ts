import { UserDataSource } from "@/domain/datasources";
import { UserRepositoryImpl } from "../user.repository.impl";
import { CreateUserDto, UpdateUserDto } from "@/domain/dtos";
import { UserEntity } from "@/domain/entities";

describe("UserRepositoryImpl", () => {
  const validDate = new Date();
  const mockUserEntityJson = {
    id: "123",
    authId: "123",
    name: "Joe",
    lastname: "Doe",
    createdAt: validDate,
    updatedAt: validDate,
  };
  const mockUserEntity: UserEntity = UserEntity.fromJson(mockUserEntityJson);
  const mockDatasource: jest.Mocked<UserDataSource> = {
    create: jest.fn(),
    deleteById: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
  };
  const repository: UserRepositoryImpl = new UserRepositoryImpl(mockDatasource);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully instance a UserRepositoryImpl", () => {
    // Assert
    expect(repository).toBeInstanceOf(UserRepositoryImpl);
  });

  describe("create", () => {
    const mockCreateUserDto: CreateUserDto = {
      authId: "123",
      name: "Joe",
      lastname: "Doe",
    };

    it("should call datasource.create with correct params", async () => {
      // Arrange
      mockDatasource.create.mockResolvedValue(mockUserEntity);

      // Act
      const result = await repository.create(mockCreateUserDto);

      // Assert
      expect(mockDatasource.create).toHaveBeenCalledWith(mockCreateUserDto);
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.name).toBe("Joe");
      expect(result.lastname).toBe("Doe");
      expect(result.authId).toBe("123");
    });
  });

  describe("getById", () => {
    it("should call datasource.getById with correct id", async () => {
      // Arrange
      const userId = "123";
      mockDatasource.getById.mockResolvedValue(mockUserEntity);

      // Act
      const result = await repository.getById(userId);

      // Assert
      expect(mockDatasource.getById).toHaveBeenCalledWith(userId);
      expect(result).toBeInstanceOf(UserEntity);
    });
  });

  describe("getAll", () => {
    it("should call datasource.getAll and return users", async () => {
      // Arrange

      mockDatasource.getAll.mockResolvedValue([
        mockUserEntity,
        UserEntity.fromJson({
          ...mockUserEntityJson,
          id: "1234",
          authId: "1234",
          deleted: false,
        }),
      ]);

      // Act
      const result = await repository.getAll();

      // Assert
      expect(mockDatasource.getAll).toHaveBeenCalled();
      result.forEach((user) => {
        expect(user).toBeInstanceOf(UserEntity);
      });
    });
  });

  describe("update", () => {
    const mockUpdateUserEntity: UserEntity = UserEntity.fromJson({
      ...mockUserEntityJson,
      name: "John",
      lastname: "Johnson",
    });

    const mockUpdateUserDto: UpdateUserDto = {
      id: "123",
      name: "John",
      lastname: "Johnson",
      values: {
        name: "John",
        lastname: "Johnson",
      },
    };

    it("should call datasource.update with correct params", async () => {
      // Arrange
      mockDatasource.update.mockResolvedValue(mockUpdateUserEntity);

      // Act
      const result = await repository.update(mockUpdateUserDto);

      // Assert
      expect(mockDatasource.update).toHaveBeenCalledWith(mockUpdateUserDto);
      expect(result).toBeInstanceOf(UserEntity);
      expect(result.name).toBe("John");
      expect(result.lastname).toBe("Johnson");
    });
  });

  describe("deleteById", () => {
    it("should call datasource.deleteById with correct id", async () => {
      // Arrange
      const mockDeletedUserEntity: UserEntity = UserEntity.fromJson({
        ...mockUserEntityJson,
        deleted: true,
        deletedAt: validDate,
      });
      const userId = "123";
      mockDatasource.deleteById.mockResolvedValue(mockDeletedUserEntity);

      // Act
      const result = await repository.deleteById(userId);

      console.log("🚧 Debug log 🚧 ", result); // TODO: Remove this console.log

      // Assert
      expect(mockDatasource.deleteById).toHaveBeenCalledWith(userId);

      expect(result).toBeInstanceOf(UserEntity);
      expect(result.deleted).toBe(true);
    });
  });
});
