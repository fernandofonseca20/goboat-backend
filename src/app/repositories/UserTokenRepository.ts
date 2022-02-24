import {
  getConnection,
  Connection,
  QueryRunner,
  FindOneOptions,
  ILike,
  Not
} from 'typeorm';
import { IUser } from '@interfaces';
import { User, UserTokens } from '@models';
import { Code } from '@utils';

class UserTokenRepository {
  private relations: string[] = [];

  async store(): Promise<number> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const code = Code.generate();
      const userToken: UserTokens = queryRunner.manager.create(UserTokens, {
        token: code
      });

      await queryRunner.manager.save(userToken);

      await queryRunner.commitTransaction();



      return code;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getById(token: number): Promise<UserTokens> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    try {
      const userToken: UserTokens = await queryRunner.manager.findOneOrFail(UserTokens, {
        where: { token }
      });

      return userToken;
    } catch (error) {
      console.log('UserTokenRepository getById error', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async destroy(id: number): Promise<string> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.getById(id);

      await queryRunner.manager.delete(User, id);

      await queryRunner.commitTransaction();

      return 'User has been deleted';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

}

export default new UserTokenRepository();
