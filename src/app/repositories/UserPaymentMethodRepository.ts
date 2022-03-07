import { getConnection, Connection, QueryRunner, In } from 'typeorm';
import { UserPaymentMethod } from '@models';
import { IPaymentMethod, IPaymentMethodList } from '@interfaces';
import { StringFormatter } from '@utils';

class UserPaymentMethodRepository {

  private relations: string[] = ['user'];
  async store(body: IPaymentMethod, userId: number): Promise<UserPaymentMethod | string> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const paymentMethodCreated = queryRunner.manager.create(UserPaymentMethod, { user: userId, ...body });

      await queryRunner.manager.save(paymentMethodCreated);

      await queryRunner.commitTransaction();

      const paymentMethod = await queryRunner.manager.findOneOrFail(UserPaymentMethod, paymentMethodCreated.id, {
        relations: this.relations
      });

      return paymentMethod;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getById(id: number, userId: number): Promise<UserPaymentMethod> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    try {
      const interest = await queryRunner.manager.findOneOrFail(UserPaymentMethod, {
        id,
        user: userId
      }, {
        relations: this.relations
      });

      return interest;
    } catch (error) {
      console.log('UserPaymentMethodRepository getById error', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async list(userId: number): Promise<IPaymentMethodList[]> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    try {
      const cards = await queryRunner.manager.find(UserPaymentMethod, {
        where: {
          user: userId
        }
      });

      const cardResults: IPaymentMethodList[] = cards.map(card => {

        const result: IPaymentMethodList = {
          id: card.id,
          credit: card.credit,
          lastNumber: card.number.substring(card.number.length - 4, 4)
        }
        return result
      });



      return cardResults;
    } catch (error) {
      console.log('UserPaymentMethodRepository list error', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id, body: IPaymentMethod): Promise<UserPaymentMethod | string> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager
        .createQueryBuilder()
        .update(UserPaymentMethod)
        .set(body)
        .where("id = :id", { id })
        .execute();

      await queryRunner.commitTransaction();

      return await queryRunner.manager.findOneOrFail(UserPaymentMethod, id);;

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
      await queryRunner.manager.findOneOrFail(UserPaymentMethod, id);

      await queryRunner.manager.delete(UserPaymentMethod, id);

      await queryRunner.commitTransaction();

      return 'Card has been deleted';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

}

export default new UserPaymentMethodRepository();
