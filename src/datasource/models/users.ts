import * as mongoose from 'mongoose';
import {createDbSchema, IFacadeSerializable} from './dataSource.interfaces';

interface DsUserProfile {
  picture: string,
  firstName: string,
  lastName: string,
  email: string
}

export interface DsUserAttributes {
  userName: string;
  hashPassword: string;
  salt: string;
  termsAgreed: boolean;
  profile: DsUserProfile;
}

const dbUserDef = createDbSchema<DsUserAttributes>({
  userName: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  termsAgreed: mongoose.Schema.Types.Boolean,
  hashPassword: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  salt: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  profile: {
    picture: mongoose.Schema.Types.String,
    firstName: mongoose.Schema.Types.String,
    lastName: mongoose.Schema.Types.String,
    email: mongoose.Schema.Types.String
  }
}, 'Users');

export interface IDsUserModel extends DsUserAttributes, IFacadeSerializable<{ userName: string, profile: DsUserProfile }> {

}

export class DbUsers extends dbUserDef.model {
}

export class DsUserModel implements IDsUserModel {
  hashPassword: string;
  profile: DsUserProfile;
  userName: string;
  salt: string;
  termsAgreed: boolean;

  toJson(): { userName: string, profile: DsUserProfile } {
    return {
      userName: this.userName,
      profile: this.profile
    };
  }

  static fromDbModel(model: DbUsers): DsUserModel | null {
    if (!model) {
      return null;
    }

    const obj = model.toObject();

    const uModel = new DsUserModel();
    uModel.hashPassword = obj.hashPassword;
    uModel.profile = obj.profile;
    uModel.userName = obj.userName;
    uModel.termsAgreed = obj.termsAgreed;
    uModel.salt = obj.salt;

    return uModel;
  }
}
