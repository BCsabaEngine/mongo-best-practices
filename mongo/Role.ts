import { Static, Type } from '@sinclair/typebox'
import * as mongoose from 'mongoose';

import * as mongooseCommon from './common';

export const Role = Type.Object({
    code: Type.String(),
    name: Type.String(),
    description: Type.String(),
});
export type Role = Static<typeof Role>;

export const RoleSchema = new mongoose.Schema<Role>(mongooseCommon.typeBoxToMongooseSchemaDefinition(Role), {
    collection: 'role',
    ...mongooseCommon.DEF_SCHEMA_PARAM,
})
    .index({ code: 1 }, { unique: true })
    .index({ name: 1 })

export const RoleModel = mongoose.model('role', RoleSchema);
