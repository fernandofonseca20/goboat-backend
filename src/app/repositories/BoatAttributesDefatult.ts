import { getConnection, Connection, QueryRunner, In } from 'typeorm';
import { BoatAttributesDefaults } from '@models';
// import { IBoatAttributesDefatult } from '@interfaces';
// import { StringFormatter } from '@utils';

class BoatAttributesDefatult {
  
  async listActives() : Promise<BoatAttributesDefaults[]> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    const boatAttrbiutesDefaults = await queryRunner.manager.find(BoatAttributesDefaults, {
      where: {
        actived: true
      }
    })
    await queryRunner.release();
    return boatAttrbiutesDefaults
  }
}

export default new BoatAttributesDefatult();
