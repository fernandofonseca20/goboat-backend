import {
  getConnection,
  Connection,
  QueryRunner,
} from 'typeorm';
import { UserSaves } from '@models';

class UserSavesRepository {

  async getUserSaves(userId: number, categoryId: number | undefined): Promise<UserSaves[]> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    const userSavesQuery = queryRunner.manager
      .createQueryBuilder(UserSaves, 'userSaves')
      .leftJoinAndSelect("userSaves.boat", "boat");

    userSavesQuery.where('userSaves.userId = :userId', { userId })
    if (categoryId) {
      userSavesQuery.where('boat.boatCategoryId = :categoryId', { categoryId })
    }

    const userSaves = await userSavesQuery.getMany();
    await queryRunner.release();

    return userSaves;
  }

  async storeSave(userId: number, boatId: number) {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    const userSaveCreateed = await queryRunner.manager.create(UserSaves, {
      user: userId,
      boat: boatId
    });

    await queryRunner.manager.save(userSaveCreateed);

    await queryRunner.release();

    return userSaveCreateed;
  }
  async existSave(userId: number, boatId: number): Promise<UserSaves | false> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    const userSave = await queryRunner.manager.findOne(UserSaves, {
      where: {
        user: userId,
        boat: boatId
      }
    });

    await queryRunner.release();

    if (userSave)
      return userSave

    return false;
  }
  async destroySave(userSaveId: number): Promise<string> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    await queryRunner.manager.delete(UserSaves, userSaveId);

    await queryRunner.commitTransaction();

    return 'save deleted';
  }

}

export default new UserSavesRepository();
