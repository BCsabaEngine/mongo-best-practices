import { Static, Type } from '@sinclair/typebox'
import * as mongoose from 'mongoose';

import * as mongooseCommon from './common';

export const CommonCustomerAddress = Type.Object({
    code: Type.String(),
    zip: Type.String(),
    city: Type.String(),
    address: Type.Optional(Type.String()),
});

export const LegacyCustomer = Type.Object({
    code: Type.String(),
    firstName: Type.String(),
    lastName: Type.String({ default: 'Gizy' }),
    mainAddress: CommonCustomerAddress,
});
export const NewCustomer = Type.Object({
    code: Type.String(),
    firstName: Type.String(),
    lastName: Type.String({ default: 'Gizy' }),
    addresses: Type.Array(CommonCustomerAddress),
    tags: Type.Array(Type.String()),
});
export const MixedCustomer = Type.Intersect([
    LegacyCustomer,
    NewCustomer]);
export type MixedCustomer = Static<typeof MixedCustomer>;

export const MixedCustomerSchema = new mongoose.Schema<MixedCustomer>(mongooseCommon.typeBoxToMongooseSchemaDefinition(MixedCustomer), {
    collection: 'mixedcustomer',
    ...mongooseCommon.DEF_SCHEMA_PARAM,
})
    .index({ code: 1 }, { unique: true })
    .index({ firstName: 1 })

export const MixedCustomerModel = mongoose.model('MixedCustomer', MixedCustomerSchema);
