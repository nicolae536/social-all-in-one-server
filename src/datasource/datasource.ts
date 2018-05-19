import {IRepoFindById, IRepoCreate, IRepoUpdate, IRepoRemove} from './models/dataSource.interfaces';
import {IDsSessionModel, DsSessionAttributes} from './models/sessions';
import {IDsUserModel, DsUserAttributes} from './models/users';

export interface DsSessionRepo extends IRepoFindById<IDsSessionModel, {}>,
  IRepoCreate<DsSessionAttributes, IDsSessionModel>,
  IRepoUpdate<DsSessionAttributes, IDsSessionModel>,
  IRepoRemove<{ id: string }, IDsSessionModel> {
}

export interface DsUsersRepo extends IRepoFindById<IDsUserModel, { password?: string }>,
  IRepoCreate<DsUserAttributes, IDsUserModel>,
  IRepoUpdate<DsUserAttributes, IDsUserModel>,
  IRepoRemove<{ id: string }, IDsUserModel> {
}

