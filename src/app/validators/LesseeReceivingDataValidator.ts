import * as Yup from 'yup';
import { ILesseeReceivingData } from '@interfaces';

class LesseeReceivingDataValidator {
  async storePix(obj: object): Promise<ILesseeReceivingData> {
    const schemaEmail = Yup.object().shape({
      email: Yup.string().email().required()
    })
    const schema = Yup.object().shape({
      type: Yup.string().test(value => value === 'pix').required(),
      status: Yup.boolean().required(),
      pixType: Yup.string().test(value => ['cpf', 'phone', 'email', 'random'].includes(value)).required(),
      pixKey: Yup.string().test('pixKeyValidateTest',
        'Validanção da chave não confere',
        async function (item) {
          switch (this.parent.pixType) {
            case 'cpf':
              if (item.length < 11)
                return false;
              return true;
            case 'email':
              const emailValid = await schemaEmail.validate({ email: item });
              if (emailValid.email) { return true; }
              return false;
            default: return true;

          }
        }).required(),
    }
    );

    const body: ILesseeReceivingData = await schema.validate(obj);

    return body;
  }
  async storeBank(obj: object): Promise<ILesseeReceivingData> {
    const schema = Yup.object().shape({
      type: Yup.string().test(value => value === 'bankAccount').required(),
      status: Yup.boolean().required(),
      bankHolderName: Yup.string().required(),
      bankAgency: Yup.string().required(),
      bank: Yup.string().required(),
      bankHolderDocument: Yup.string().required(),
      bankAccount: Yup.string().required(),
      bankIdStripe: Yup.string().required(),
    }
    );

    const body: ILesseeReceivingData = await schema.validate(obj);

    return body;
  }

  // async update(obj: object): Promise<IUser> {
  //   const schema = Yup.object().shape({
  //   });

  //   const body: IUser = await schema.validate(obj);

  //   return body;
  // }

}

export default new LesseeReceivingDataValidator();
