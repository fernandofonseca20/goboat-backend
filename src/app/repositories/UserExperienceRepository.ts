import {
  getConnection,
  Connection,
  QueryRunner,
  In,
  FindManyOptions,
} from 'typeorm';
import { UserExperience } from '@models';

class UserExperienceRepository {
  async getUserExperienceIds(userId: number): Promise<number[]> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    const ids: number[] = [];

    const userExperiences: any[] = await queryRunner.manager.find(UserExperience, {
      where: { user: userId },
      relations: ['boatCategory'],
    });

    userExperiences.forEach((userInterest) => {
      ids.push(userInterest.boatCategory.id);
    });

    await queryRunner.release();

    return ids;
  }

  async getUserExperience(query: FindManyOptions<UserExperience>) {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    const userExperiences = await queryRunner.manager.find(UserExperience, query);

    await queryRunner.release();

    return userExperiences;
  }

  async setUserExperience(
    userId: number,
    userInterestIds: number[],
    interestIds: number[]
  ): Promise<void> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newInterestIds: object[] = [];
      const removeInterestIds: number[] = [];

      // * remove all user interests
      if (interestIds.length === 0) {
        const userExperiences = await this.getUserExperience({
          where: { user: userId },
        });

        await connection
          .createQueryBuilder()
          .delete()
          .from(UserExperience)
          .where(userExperiences)
          .execute();

        await queryRunner.commitTransaction();

        return;
      }

      // * get new interests
      interestIds.forEach((interestId) => {
        if (!userInterestIds.includes(interestId))
          newInterestIds.push({
            user: userId,
            interest: interestId,
          });
      });

      // * get remove interests
      userInterestIds.forEach((userInterest) => {
        if (!interestIds.includes(userInterest))
          removeInterestIds.push(userInterest);
      });

      if (newInterestIds.length > 0) {
        await connection
          .createQueryBuilder()
          .insert()
          .into(UserExperience)
          .values(newInterestIds)
          .execute();
      }

      if (removeInterestIds.length > 0) {
        const userExperiences = await this.getUserExperience({
          where: { interest: In(removeInterestIds) },
        });

        await connection
          .createQueryBuilder()
          .delete()
          .from(UserExperience)
          .where(userExperiences)
          .execute();
      }

      await queryRunner.commitTransaction();

      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await connection.close();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

export default new UserExperienceRepository();
