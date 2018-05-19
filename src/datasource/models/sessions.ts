import {ObjectID} from 'bson';
import * as mongoose from 'mongoose';
import {IRecord, IFacadeSerializable, createDbSchema} from './dataSource.interfaces';

// attributes
export interface DsSessionAttributes extends IRecord {
  createdDate: string;
  validUntil: string;
  // ref to users id table
  userId: string;
  userInfo: string;
}

const dbModel = createDbSchema<DsSessionAttributes>({
  createdDate: mongoose.Schema.Types.String,
  id: mongoose.Schema.Types.ObjectId,
  userId: mongoose.Schema.Types.String,
  userInfo: mongoose.Schema.Types.String,
  validUntil: mongoose.Schema.Types.String
}, 'Session');

export class DbSessions extends dbModel.model {
}

export interface IDsSessionModel extends DsSessionAttributes, IFacadeSerializable<DsSessionAttributes> {
}

export class DsSessionModel implements IDsSessionModel {
  createdDate: string;
  userId: string;
  userInfo: string;
  validUntil: string;
  id: ObjectID;

  toJson(): DsSessionAttributes {
    // toHexString()
    return {
      createdDate: this.createdDate,
      userId: this.userId,
      validUntil: this.validUntil,
      userInfo: this.userInfo,
      id: this.id.toHexString()
    };
  }

  static fromDbModel(model: DbSessions): DsSessionModel | null {
    if (!model) {
      return null;
    }

    const obj = model.toObject();
    return DsSessionModel.fromJson(obj);
  }

  static fromJson(obj: any) {
    const data = new DsSessionModel();

    data.createdDate = obj.createdDate;
    if (obj.id instanceof mongoose.Types.ObjectId) {
      data.id = obj.id;
    } else {
      data.id = mongoose.Types.ObjectId.createFromHexString(obj.id);
    }
    data.userId = obj.userId;
    data.userInfo = obj.userInfo;
    data.validUntil = obj.validUntil;

    return data;
  }

}

