import {ObjectID} from 'bson';
import * as mongoose from 'mongoose';
import {SchemaTypeOpts, SchemaType, Schema} from 'mongoose';

export interface IRecord {
  // null on create
  // ObjectID for db
  // string for toJson
  id: ObjectID | null | string;
}

// used to serialize data to be passed to UI // outside connections
// public data serializer
export interface IFacadeSerializable<TSerialized> {
  toJson(): TSerialized;
}

export interface IFacadeDbSerializable<TSerialized> {
  toDbModel(): TSerialized;
}


/// Repo interfaces
export interface IRepoFindById<TModel, TOptions> {
  findById(id: string, options?: TOptions): Promise<TModel | null>
}

export interface IRepoCreate<TModel, TOut> {
  create(model: TModel): Promise<TOut>;
}

export interface IRepoUpdate<TModel, TOut> {
  update(id: string, model: TModel): Promise<TOut>;
}

export interface IRepoRemove<TCriteria, TOut> {
  remove(criteria: TCriteria): Promise<TOut>;
}

export interface IRepoSearch<TModel, TOptions> {
  search(options: TOptions): Promise<TModel[]>;
}

export interface IPersistResult<TOut> {
  status: 'created' | 'updated' | 'error',
  message: string;
  payload: TOut
}

export function basePersistResult<TOut>(status: 'created' | 'updated' | 'error', message: string, payload: TOut): IPersistResult<TOut> {
  return {
    status: status,
    message: message,
    payload: payload
  };
}

export type MongoSchema<T> = {
  [P in keyof T]: SchemaTypeOpts<any> | Schema | SchemaType;
}

export function createDbSchema<T>(schema: MongoSchema<T>, name: string) {
  const schemaModel = new mongoose.Schema(schema);

  return {
    schema: schemaModel,
    model: mongoose.model(name, schemaModel)
  };
}

