import {MigrationInterface, QueryRunner, getRepository} from "typeorm";
import { BoatCategories } from '../seeds';
export class BoatCategory1645635929464 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await getRepository('BoatCategory').save(BoatCategories);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await getRepository('BoatCategory').remove(BoatCategories);
    }

}
