import {
  getConnection,
  Connection,
  QueryRunner,
  FindOneOptions,
  ILike,
  Not
} from 'typeorm';
import { IUser } from '@interfaces';
import { User, UserTokens } from '@models';
import { Code } from '@utils';

class UserRepository {
  private relations: string[] = ['lessee'];

  async store(body: IUser): Promise<User> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { email, password, firstName, lastName, bornDate, documentNumber} = body;

      const user: User = queryRunner.manager.create(User, {
        email,
        password,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        bornDate,
        documentNumber,
        ...body
      });

      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();

      delete user.password;

      return user;
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

    const users: User[] = await queryRunner.manager.find(User, {
      order: {
        createdAt: 'ASC',
      },
      take: +itemsPerPage,
      skip: +page * +itemsPerPage,
      relations: this.relations,
    });

    const total: number = await queryRunner.manager.count(User);

    await queryRunner.release();

    return {
      users,
      total: {
        items: total,
        pages: total > +itemsPerPage ? total / +itemsPerPage : total,
      },
      currentPage: +page,
      itemsPerPage: +itemsPerPage,
    };
  }

  async getById(id: number): Promise<User> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    try {
      const user: User = await queryRunner.manager.findOneOrFail(User, id, {
        relations: this.relations,
      });

      return user;
    } catch (error) {
      console.log('InterestRepository getById error', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(query: FindOneOptions<User>) {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    try {
      const user = await queryRunner.manager.findOne(User, {
        ...query,
        relations: this.relations,
      });

      return user;
    } catch (error) {
      console.log('UserRepository findOne error', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findOneById(id: number) {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    try {
      const user = await queryRunner.manager.findOne(User, id, {
        relations: this.relations,
      });

      return user;
    } catch (error) {
      console.log('UserRepository findOneById error', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async searchByName(
    name: string,
    page: number,
    itemsPerPage: number,
    userId: number
  ): Promise<object> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    const users: User[] = await queryRunner.manager.find(User, {
      where: {
        fullName: ILike(`%${name}%`),
        id: Not(userId)
      },
      take: +itemsPerPage,
      skip: +page * +itemsPerPage,
      relations: [...this.relations],
    });

    const total: number = await queryRunner.manager.count(User,  {
      where: {
        fullName: ILike(`%${name}%`),
        id: Not(userId)
      },
    });

    await queryRunner.release();

    return {
      users,
      total: {
        items: total,
        pages: Math.round(total / +itemsPerPage) ,
      },
      currentPage: +page,
      itemsPerPage: +itemsPerPage,
    };
  }

  async update(id: number, body: any): Promise<User> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const { firstName, lastName } = body;

      const userExists: User = await this.getUserWithPassword({ id });

      let { fullName } = userExists;

      if (Object.keys(body).length === 0 && Object.getPrototypeOf(body)) {
        await queryRunner.release();
        return userExists;
      }

      if (firstName || lastName)
        fullName = `${firstName || userExists.firstName} ${
          lastName || userExists.lastName
        }`;

      await queryRunner.manager.update(User, id, {
        ...body,
        fullName,
      });
      console.log('body')
      console.log(body)

      await queryRunner.commitTransaction();
      const user: User = await this.getById(id);

      return user;
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
      await this.getById(id);

      await queryRunner.manager.delete(User, id);

      await queryRunner.commitTransaction();

      return 'User has been deleted';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async signIn(email: string, password: string): Promise<number | null> {
    const user: User = await this.getUserWithPassword({ email });

    const isValid = await user.comparePassword(password);

    if (isValid) return user.id;

    return null;
  }

  async emailExists(email: string): Promise<User | null> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();

    const user: User | null = await queryRunner.manager.findOne(User, {
      where: { email },
    });

    await queryRunner.release();

    return user;
  }

  async generateCode(
    emailOrPhone: string,
    type: 'email' | 'phone'
  ): Promise<number> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const code = Code.generate();

      await queryRunner.manager.update(
        User,
        type === 'email' ? { email: emailOrPhone } : { phone: emailOrPhone },
        {
          code,
        }
      );

      await queryRunner.commitTransaction();

      return code;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log('UserRepository generateCode error', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async checkCode(
    emailOrPhone: string,
    type: 'email' | 'phone',
    code: number
  ): Promise<User> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userExists = await queryRunner.manager.findOneOrFail(User, {
        where:
          type === 'email'
            ? { email: emailOrPhone, code }
            : { phone: emailOrPhone, code },
      });

      if (!userExists.validatedPhone) {
        await queryRunner.manager.update(
          User,
          type === 'email' ? { email: emailOrPhone } : { phone: emailOrPhone },
          type === 'email'
            ? { validatedEmail: true }
            : { validatedPhone: true }
        );
      }

      await queryRunner.commitTransaction();

      const user = await queryRunner.manager.findOneOrFail(User, {
        where:
          type === 'email' ? { email: emailOrPhone } : { phone: emailOrPhone },
      });

      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log('UserRepository checkCode error', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async resetPassword(
    emailOrPhone: string,
    type: 'email' | 'phone',
    code: number,
    password: string
  ): Promise<string> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const userExists = await queryRunner.manager.findOneOrFail(User, {
        where:
          type === 'email'
            ? { email: emailOrPhone, code }
            : { phone: emailOrPhone, code },
      });

      const hashPassword = await userExists.hashPassword(password);

      await queryRunner.manager.update(
        User,
        type === 'email' ? { email: emailOrPhone } : { phone: emailOrPhone },
        { password: hashPassword, code: null }
      );

      await queryRunner.commitTransaction();

      return 'Senha resetada';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log('UserRepository resetPassword error', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async getUserWithPassword(query: object): Promise<User> {
    const connection: Connection = getConnection();
    const queryRunner: QueryRunner = connection.createQueryRunner();

    await queryRunner.connect();
    // @ts-ignore
    const user: User = await queryRunner.manager.findOneOrFail(User, query, {
      select: ['id', 'firstName', 'lastName', 'fullName', 'password'],
    });

    await queryRunner.release();

    return user;
  }
}

export default new UserRepository();
