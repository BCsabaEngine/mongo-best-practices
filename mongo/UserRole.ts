import { Static, Type } from '@sinclair/typebox'
import * as mongoose from 'mongoose';

import * as mongooseCommon from './common';

export const UserRole = Type.Object({
    user: mongooseCommon.TypeObjectId('user'),
    role: mongooseCommon.TypeObjectId('role'),
});
export type UserRole = Static<typeof UserRole>;

export const UserRoleSchema = new mongoose.Schema<UserRole>(
    mongooseCommon.typeBoxToMongooseSchemaDefinition(UserRole),
    {
        collection: 'userrole',
        ...mongooseCommon.DEF_SCHEMA_PARAM,
    })
    //.index({ user: 1, role: 1 }, { unique: true })
    .index({ user: 1, role: 1 })

export const UserRoleModel = mongoose.model('userrole', UserRoleSchema);
