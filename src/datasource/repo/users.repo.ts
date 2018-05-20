import {CommunicationError} from '../../utils';
import {DsUsersRepo} from '../datasource';
import {DsUserAttributes, IDsUserModel, DbUsers, DsUserModel} from '../models/users';
import {saltHashPassword, hashString} from '../util';

export class DsUsersRepoImpl implements DsUsersRepo {
  async create(model: DsUserAttributes): Promise<IDsUserModel> {
    const userInDb = await DbUsers.findOne({userName: model.userName});
    if (userInDb) {
      CommunicationError.badRequest('Cannot user already exists');
    }

    // add salt to password
    const passwordData = saltHashPassword(model.hashPassword);
    model.hashPassword = passwordData.passwordHash;
    model.salt = passwordData.salt;

    const dbModel = new DbUsers(model);
    return dbModel.save().then(DsUserModel.fromDbModel).catch(e => CommunicationError.dbError(e, 'users'));
  }

  async findById(id: string, options?: { password?: string }): Promise<IDsUserModel> {
    if (!options) {
      return DbUsers.findById(id).then(DsUserModel.fromDbModel).catch(() => null);
    }

    // id -> is the username

    const user = await DbUsers.findOne({userName: id}).then(DsUserModel.fromDbModel);
    if (!user) {
      return null;
    }

    const userPassword = hashString(options.password, user.salt);
    if (userPassword.passwordHash !== user.hashPassword) {
      return null;
    }

    return user;
  }

  remove(criteria: { id: string }): Promise<IDsUserModel> {
    return DbUsers.findByIdAndRemove(criteria.id).then(DsUserModel.fromDbModel).catch(e => CommunicationError.dbError(e, 'users'));
  }

  update(id: string, model: DsUserAttributes): Promise<IDsUserModel> {
    if (model.hashPassword) {
      const passwordData = saltHashPassword(model.hashPassword);
      model.hashPassword = passwordData.passwordHash;
      model.salt = passwordData.salt;
    }

    return DbUsers.findByIdAndUpdate(id, model).then(DsUserModel.fromDbModel).catch(e => CommunicationError.dbError(e, 'users'));
  }
}