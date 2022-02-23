import { getConnection, Connection, QueryRunner, In } from 'typeorm';
import { BoatCategory } from '@models';
import { IBoatCategory } from '@interfaces';
import { StringFormatter } from '@utils';

class BoatCategoryRepository {
  async store(body: IBoatCategory): Promise<BoatCategory | string> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { title } = body;

      const boatCategoryTitle = StringFormatter.capitalizeFirstLetter(title);

      const interestAlreadyExists = await queryRunner.manager.findOne(
        BoatCategory,
        {
          title: boatCategoryTitle,
        }
      );

      if (interestAlreadyExists) {
        await queryRunner.release();
        return 'BoatCategory already exists';
      }

      const interest = queryRunner.manager.create(BoatCategory, {
        title: boatCategoryTitle,
      });

      await queryRunner.manager.save(interest);

      await queryRunner.commitTransaction();

      return interest;
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

    const [interests, total]: [BoatCategory[], number] =
      await queryRunner.manager.findAndCount(BoatCategory, {
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

  async getById(id: number): Promise<BoatCategory> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    try {
      const interest = await queryRunner.manager.findOneOrFail(BoatCategory, id);

      return interest;
    } catch (error) {
      console.log('BoatCategoryRepository getById error', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, body: IBoatCategory): Promise<BoatCategory | string> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { title } = body;

      const interestExists = await queryRunner.manager.findOneOrFail(
        BoatCategory,
        id
      );

      if (Object.keys(body).length === 0 && Object.getPrototypeOf(body)) {
        await queryRunner.release();
        return interestExists;
      }

      const boatCategoryTitle = StringFormatter.capitalizeFirstLetter(title);

      const titleIsUnavailable = await queryRunner.manager.findOne(BoatCategory, {
        title: boatCategoryTitle,
      });

      if (titleIsUnavailable) {
        await queryRunner.release();
        return 'Already has one interest with this title';
      }

      await queryRunner.manager.update(BoatCategory, id, {
        title: boatCategoryTitle,
      });

      await queryRunner.commitTransaction();

      const interest = await queryRunner.manager.findOneOrFail(BoatCategory, id);

      return interest;
    } catch (error) {
      await queryRunner.rollbackTransaction();
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
      await queryRunner.manager.findOneOrFail(BoatCategory, id);

      await queryRunner.manager.delete(BoatCategory, id);

      await queryRunner.commitTransaction();

      return 'BoatCategory has been deleted';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async validateIds(ids: number[]): Promise<number[]> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    const interestIds: number[] = [];

    const interests = await queryRunner.manager.find(BoatCategory, {
      where: { id: In(ids) },
    });

    interests.forEach((interest) => interestIds.push(interest.id));

    await queryRunner.release();

    return interestIds;
  }
  async listActives() : Promise<BoatCategory[]> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    const boatCategories = await queryRunner.manager.find(BoatCategory, {
      where: {
        actived: true
      }
    })
    await queryRunner.release();
    return boatCategories
  }
}

export default new BoatCategoryRepository();
