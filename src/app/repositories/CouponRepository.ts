import { getConnection, Connection, QueryRunner, In } from 'typeorm';
import { Coupon, BoatRents } from '@models';
import { ICoupon } from '@interfaces';
import { StringFormatter } from '@utils';

class CouponRepository {


  async getByCode(code: string): Promise<Coupon> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    try {
      const coupon = await queryRunner.manager.findOne(Coupon, {
        where: {
          code,
        }
      });

      return coupon;
    } catch (error) {
      console.log('CouponRepository getById error', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getUsed(code: string, userId: number): Promise<Coupon | string> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    try {
      const coupon = await queryRunner.manager.findOne(Coupon, {
        where: {
          code,
        }
      });
      if (!coupon)
        return 'Coupon not found';

      const couponUsed = await queryRunner.manager.findOne(BoatRents, {
        where: {
          coupon: coupon.id,
          user: userId
        }
      });
      if (couponUsed)
        return 'Coupon used';

      return coupon;
    } catch (error) {
      console.log('CouponRepository getUsed error', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

}

export default new CouponRepository();
