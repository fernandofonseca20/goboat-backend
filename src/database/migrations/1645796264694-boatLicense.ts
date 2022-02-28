import {MigrationInterface, QueryRunner, getRepository} from "typeorm";
import { BoatLicense } from '../seeds';

export class boatLicense1645796264694 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await getRepository('BoatLicense').save(BoatLicense);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await getRepository('BoatLicense').remove(BoatLicense);
    }
}
