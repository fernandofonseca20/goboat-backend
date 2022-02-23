import jwt from 'jsonwebtoken';

class Token {
  async generateUserToken(id: string | number) {
    const token: string = jwt.sign(
      { id, class: 'user' },
      process.env.JWT_SECRET
    );

    return token;
  }

  decode(token: string): any {
    const user = jwt.decode(token);

    return user;
  }
}

export default new Token();
