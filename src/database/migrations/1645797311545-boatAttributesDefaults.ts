import {MigrationInterface, QueryRunner, getRepository} from "typeorm";
import { BoatAttributesDefaults } from '../seeds';


export class boatAttributesDefaults1645797311545 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await getRepository('BoatAttributesDefaults').save(BoatAttributesDefaults);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await getRepository('BoatAttributesDefaults').remove(BoatAttributesDefaults);
    }

}
