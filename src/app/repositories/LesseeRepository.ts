import { getConnection, Connection, QueryRunner, In } from 'typeorm';
import { Lessee, User } from '@models';
import { ILessee } from '@interfaces';
import { StringFormatter } from '@utils';

class LesseeRepository {
  async store(body: ILessee): Promise<Lessee | string> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const interestAlreadyExists = await queryRunner.manager.findOne(
        Lessee,
        {
          user: body.user,
        }
      );

      if (interestAlreadyExists) {
        await queryRunner.release();
        return 'Lessee already exists';
      }

      const lessee = queryRunner.manager.create(Lessee, {
        user: body.user,
      });

      await queryRunner.manager.save(lessee);

      
      await queryRunner.manager.update(User, body.user, {
        lessee: lessee.id,
      });

      await queryRunner.commitTransaction();

      return lessee;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async list(page: number, itemsPerPage: number): Promise<object> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    const [interests, total]: [Lessee[], number] =
      await queryRunner.manager.findAndCount(Lessee, {
        order: {
          createdAt: 'ASC',
        },
        take: +itemsPerPage,
        skip: +page * +itemsPerPage,
      });

    await queryRunner.release();

    return {
      interests,
      total: {
        items: total,
        pages: total > +itemsPerPage ? total / +itemsPerPage : total,
      },
      currentPage: +page,
      itemsPerPage: +itemsPerPage,
    };
  }

  async getById(id: number): Promise<Lessee> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    try {
      const interest = await queryRunner.manager.findOne(Lessee, {
        user: id
      });

      return interest;
    } catch (error) {
      console.log('LesseeRepository getById error', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async getByUserId(id: number): Promise<Lessee> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    try {
      const interest = await queryRunner.manager.findOne(Lessee, {
        user: id
      });

      return interest;
    } catch (error) {
      console.log('LesseeRepository getById error', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

export default new LesseeRepository();
