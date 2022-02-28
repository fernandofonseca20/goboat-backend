import { getConnection, Connection, QueryRunner, In } from 'typeorm';
import { BoatLicense } from '@models';
import { IBoatLicense } from '@interfaces';
import { StringFormatter } from '@utils';

class BoatLicenseRepository {
  async store(body: IBoatLicense): Promise<BoatLicense | string> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { title } = body;

      const boatLicenseTitle = StringFormatter.capitalizeFirstLetter(title);

      const licenseAlreadyExists = await queryRunner.manager.findOne(
        BoatLicense,
        {
          title: boatLicenseTitle,
        }
      );

      if (licenseAlreadyExists) {
        await queryRunner.release();
        return 'BoatLicense already exists';
      }

      const license = queryRunner.manager.create(BoatLicense, {
        title: boatLicenseTitle,
      });

      await queryRunner.manager.save(license);

      await queryRunner.commitTransaction();

      return license;
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

    const [licenses, total]: [BoatLicense[], number] =
      await queryRunner.manager.findAndCount(BoatLicense, {
        order: {
          createdAt: 'ASC',
        },
        take: +itemsPerPage,
        skip: +page * +itemsPerPage,
      });

    await queryRunner.release();

    return {
      licenses,
      total: {
        items: total,
        pages: total > +itemsPerPage ? total / +itemsPerPage : total,
      },
      currentPage: +page,
      itemsPerPage: +itemsPerPage,
    };
  }

  async getById(id: number): Promise<BoatLicense> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    try {
      const license = await queryRunner.manager.findOne(BoatLicense, id);

      return license;
    } catch (error) {
      console.log('BoatLicenseRepository getById error', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, body: IBoatLicense): Promise<BoatLicense | string> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { title } = body;

      const licenseExists = await queryRunner.manager.findOneOrFail(
        BoatLicense,
        id
      );

      if (Object.keys(body).length === 0 && Object.getPrototypeOf(body)) {
        await queryRunner.release();
        return licenseExists;
      }

      const boatLicenseTitle = StringFormatter.capitalizeFirstLetter(title);

      const titleIsUnavailable = await queryRunner.manager.findOne(BoatLicense, {
        title: boatLicenseTitle,
      });

      if (titleIsUnavailable) {
        await queryRunner.release();
        return 'Already has one license with this title';
      }

      await queryRunner.manager.update(BoatLicense, id, {
        title: boatLicenseTitle,
      });

      await queryRunner.commitTransaction();

      const license = await queryRunner.manager.findOneOrFail(BoatLicense, id);

      return license;
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
      await queryRunner.manager.findOneOrFail(BoatLicense, id);

      await queryRunner.manager.delete(BoatLicense, id);

      await queryRunner.commitTransaction();

      return 'BoatLicense has been deleted';
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

    const licenseIds: number[] = [];

    const licenses = await queryRunner.manager.find(BoatLicense, {
      where: { id: In(ids) },
    });

    licenses.forEach((license) => licenseIds.push(license.id));

    await queryRunner.release();

    return licenseIds;
  }
  async listActives() : Promise<BoatLicense[]> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    const boatCategories = await queryRunner.manager.find(BoatLicense, {
      where: {
        actived: true
      }
    })
    await queryRunner.release();
    return boatCategories
  }
}

export default new BoatLicenseRepository();
