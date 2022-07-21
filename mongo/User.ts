import { Static, Type } from '@sinclair/typebox'
import * as mongoose from 'mongoose';

import * as mongooseCommon from './common';

export const User = Type.Object({
    username: Type.String(),
    realname: Type.String(),
    password: Type.String(),
});
export type User = Static<typeof User>;

export const UserSchema = new mongoose.Schema<User>(mongooseCommon.typeBoxToMongooseSchemaDefinition(User), {
    collection: 'user',
    ...mongooseCommon.DEF_SCHEMA_PARAM,
})
    .index({ username: 1 }, { unique: true })
    .index({ username: 1, password:1 })

export const UserModel = mongoose.model('user', UserSchema);
