import { getConnection, Connection, QueryRunner, In } from 'typeorm';
import { BoatRents } from '@models';
import { IBoatRent } from '@interfaces';
import { StringFormatter } from '@utils';

class BoatRentRepository {


  private relations: string[] = ['user', 'boat','boat.lessee','boat.lessee.user', ];

  async store(body: IBoatRent): Promise<BoatRents | string> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const boatRent = queryRunner.manager.create(BoatRents, body);

      await queryRunner.manager.save(boatRent);

      await queryRunner.commitTransaction();

      return boatRent;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async listByLesse(lesseeId: number): Promise<object> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    const rows: BoatRents[]=
      await queryRunner.manager.find(BoatRents, {
        where:{
          'boat.lessee': lesseeId
        },
        order: {
          createdAt: 'DESC',
        },
        relations: ['boat', 'boat.lessee']
      });

    await queryRunner.release();

    return rows;
  }

  async listByUser(userId: number): Promise<object> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    const rows: BoatRents[] =
      await queryRunner.manager.find(BoatRents, {
        where:{
          user: userId,
        },
        order: {
          createdAt: 'DESC',
        },
      });

    await queryRunner.release();

    return rows;
  }

  async getById(id: number): Promise<BoatRents> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    try {
      const boatRent = await queryRunner.manager.findOne(BoatRents, id, {
        relations: this.relations
      });

      return boatRent;
    } catch (error) {
      console.log('BoatRentRepository getById error', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async existRentNoAproved(boatId: number, userId: number): Promise<BoatRents> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    try {
      const boatRent = await queryRunner.manager.findOne(BoatRents, {
        where: {
          user: userId,
          boat: boatId,
          status: In(['waitingApproval', 'waintingPayment', 'confirmed'])
        },
      });

      return boatRent;
    } catch (error) {
      console.log('BoatRentRepository existRentNoAproved error', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, body: IBoatRent): Promise<BoatRents | string> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {


      await queryRunner.manager.update(BoatRents, id, body);

      await queryRunner.commitTransaction();

      const boatRent = await queryRunner.manager.findOneOrFail(BoatRents, id);

      return boatRent;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

export default new BoatRentRepository();
