import { getConnection, Connection, QueryRunner, In } from 'typeorm';
import { Lessee, User, LesseeReceivingData, } from '@models';
import { ILesseeReceivingData, ILesseeReceivingDataUpdate } from '@interfaces';
import { StringFormatter } from '@utils';

class LesseeReceivingDataRepository {
  async store(body: ILesseeReceivingData, lesseeId: number): Promise<LesseeReceivingData> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const lesseeReceivingData = queryRunner.manager.create(LesseeReceivingData, {
        lessee: lesseeId,
        ...body
      });

      await queryRunner.manager.save(lesseeReceivingData);

      await queryRunner.commitTransaction();

      return lesseeReceivingData;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getPrincipal(lesseeId: number): Promise<LesseeReceivingData> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    const row: LesseeReceivingData =
      await queryRunner.manager.findOne(LesseeReceivingData, {
        where: {
          lessee: lesseeId,
          principal: true
        },
        order: {
          createdAt: 'DESC',
        },
      });

    await queryRunner.release();

    return row;
  }

  async list(lesseeId: number): Promise<LesseeReceivingData[]> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    const rows: LesseeReceivingData[] =
      await queryRunner.manager.find(LesseeReceivingData, {
        where: {
          lessee: lesseeId
        },
        order: {
          createdAt: 'DESC',
        },
      });

    await queryRunner.release();

    return rows;
  }

  async getById(id: number, lesseeId: number): Promise<LesseeReceivingData> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    try {
      const row = await queryRunner.manager.findOne(LesseeReceivingData, {
        where: {
          id,
          lessee: lesseeId
        },
      });

      return row;
    } catch (error) {
      console.log('LesseeReceivingDataRepository getById error', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async setPrincipal(id, lesseeId: number): Promise<string> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      await queryRunner.manager.update(LesseeReceivingData, {
        lessee: lesseeId,
        status: true
      }, {
        principal: false
      });

      await queryRunner.manager.update(LesseeReceivingData, id, {
        principal: true
      });

      await queryRunner.commitTransaction();

      return 'updated';

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, body: ILesseeReceivingDataUpdate, lesseeId: number): Promise<LesseeReceivingData> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.update(LesseeReceivingData, {
        lessee: lesseeId,
        id
      }, body);

      await queryRunner.commitTransaction();

      return await this.getById(id, lesseeId);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async destroy(id, lesseeId: number): Promise<string> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(LesseeReceivingData, {
        lessee: lesseeId,
        id
      });

      await queryRunner.commitTransaction();

      return 'deleted';

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

export default new LesseeReceivingDataRepository();
