/* tslint:disable:member-ordering */
import * as Yup from 'yup';
import { StringSchema } from 'yup';
import { NameInvalidError } from '../server/Error/NameInvalidError';

export class Assert {

  private static nameSchema: StringSchema = Yup.string()
    .required('Required');

  public static readonly userName: StringSchema = Yup.string()
    .min(3, 'at least 3 characters')
    .max(20, 'at most 20 characters')
    .concat(Assert.nameSchema);

  public static readonly channelName: StringSchema = Yup.string()
    .min(3, 'at least 5 characters')
    .max(20, 'at most 20 characters')
    .concat(Assert.nameSchema);

  public static readonly password: StringSchema = Yup.string()
    .min(8, 'at least 8 characters')
    .matches(/[a-z]/, 'at least one lowercase char')
    .matches(/[A-Z]/, 'at least one uppercase char')
    .matches(/[a-zA-Z]+[^a-zA-Z\s]+/, 'at least 1 number or special char (@,!,#, etc).')
    .max(120)
    .required('Required');

  public static assertUserName(name: string): name is string | never {
    if (!this.userName.isValid(name, {})) {
      throw NameInvalidError.doesNotMatchCriteria();
    }
    return true;
  }

  public static assertChannelName(name: string) {
    if (!this.channelName.isValidSync(name)) {
      throw NameInvalidError.doesNotMatchCriteria();
    }
    return true;
  }

  public static assertPassword(name: string) {
    if (!this.channelName.isValidSync(name)) {
      throw NameInvalidError.doesNotMatchCriteria();
    }
    return true;
  }

}
