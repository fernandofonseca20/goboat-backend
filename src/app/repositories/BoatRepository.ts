import { getConnection, Connection, QueryRunner, In } from 'typeorm';
import { Boat, BoatAttributes } from '@models';
import { IBoatStore, IBoatFilter } from '@interfaces';
import { StringFormatter } from '@utils';

class BoatRepository {

  private relations: string[] = ['lessee', 'lessee.user'];
  async store(body: IBoatStore, lesseeId: number): Promise<Boat | string> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { boatAttributes, boatPackage, ...boatBody } = body;

      const boatCreated = queryRunner.manager.create(Boat, { lessee: lesseeId, ...boatBody });

      await queryRunner.manager.save(boatCreated);

      for await (const attributeString of boatAttributes) {

        const attributeCreated = queryRunner.manager.create(BoatAttributes, {
          boat: boatCreated.id,
          title: attributeString
        });

        await queryRunner.manager.save(attributeCreated);
      }

      await queryRunner.commitTransaction();

      const boatgetId = await this.getById(boatCreated.id);

      return boatgetId;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async list(page, itemsPerPage: number): Promise<object> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    const [interests, total]: [Boat[], number] =
      await queryRunner.manager.findAndCount(Boat, {
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

  async getById(id: number): Promise<Boat> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    try {
      const interest = await queryRunner.manager.findOneOrFail(Boat, id, {
        relations: this.relations
      });

      return interest;
    } catch (error) {
      console.log('BoatRepository getById error', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // async update(id, body: IBoatStore): Promise<Boat | string> {
  //   const connection: Connection = getConnection();
  //   const queryRunner: QueryRunner = connection.createQueryRunner();

  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();

  //   try {

  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //     throw error;
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  async destroy(id: number): Promise<string> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.findOneOrFail(Boat, id);

      await queryRunner.manager.delete(Boat, id);

      await queryRunner.commitTransaction();

      return 'Boat has been deleted';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async search(filters: IBoatFilter, page: number = 0, itemsPerPage: number = 10): Promise<{
    rows: Boat[],
    totalItems: number,
    page: number,
    itemsPerPage: number
  }> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const { boatName, locationName, boatCategory, amountOfPeople, daily } = filters;
      const boatQuery = queryRunner.manager
        .createQueryBuilder(Boat, 'boat');

      if (boatName) boatQuery.where(' "boat"."name" ILike :name ', { name: `%${boatName}%` });
      if (locationName) boatQuery.where(' "boat"."beach" ILike :beach ', { beach: `%${locationName}%` });
      if (boatCategory) boatQuery.where(' "boat"."boatCategoryId" = :boatCategory ', { boatCategory: boatCategory });
      if (amountOfPeople) boatQuery.where(' "boat"."maximumCapacity" = :amountOfPeople ', { amountOfPeople: amountOfPeople });

      const totalItems = await boatQuery.getCount();
      const rows = await boatQuery
        .take(itemsPerPage)
        .skip((page * itemsPerPage) || 0)
        .getMany();

      await queryRunner.commitTransaction();

      return {
        rows,
        totalItems,
        page,
        itemsPerPage
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

}

export default new BoatRepository();