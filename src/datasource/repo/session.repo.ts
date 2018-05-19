import {ObjectID} from 'bson';
import * as mongoose from 'mongoose';
import {CommunicationError} from '../../utils';
import {DsSessionRepo} from '../datasource';
import {IDsSessionModel, DsSessionModel, DbSessions, DsSessionAttributes} from '../models/sessions';

export class DsSessionsRepoImpl implements DsSessionRepo {

  async create(model: DsSessionAttributes): Promise<IDsSessionModel> {
    // create id
    model.id = new mongoose.Types.ObjectId();
    const dbModel = new DbSessions(model);

    return dbModel.save().then(it => DsSessionModel.fromDbModel(it)).catch(e => CommunicationError.dbError(e, 'session'));
  }

  update(id: string, model: DsSessionAttributes): Promise<IDsSessionModel> {
    return DbSessions.updateOne({id: ObjectID.createFromHexString(id)}, model)
      .then(it => DsSessionModel.fromDbModel(it))
      .catch(e => CommunicationError.dbError(e, 'session'));
  }

  findById(id: string, options?: {}): Promise<IDsSessionModel> {
    return this.findDb(id).then(it => DsSessionModel.fromDbModel(it));
  }

  async remove(criteria: { id: string }): Promise<IDsSessionModel> {
    return DbSessions.deleteOne({id: this.getId(criteria.id)}).then(it => DsSessionModel.fromDbModel(it));
  }

  private findDb(id: string | ObjectID) {
    return DbSessions.findOne({id: this.getId(id)});
  }

  private getId(id: string | ObjectID) {
    if (typeof id === 'string') {
      id = ObjectID.createFromHexString(id);
    }

    return id;
  }
}