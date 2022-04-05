import { Static, Type } from '@sinclair/typebox'
import * as mongoose from 'mongoose';

import * as mongooseCommon from './common';

export const CustomerAddress = Type.Object({
    code: Type.String(),
    zip: Type.String(),
    city: Type.String(),
    address: Type.Optional(Type.String()),
});

export const Customer = Type.Object({
    code: Type.String(),
    firstName: Type.String(),
    lastName: Type.String({ default: 'Gizy' }),
    isFemale: Type.Boolean({ default: false }),
    birthDate: mongooseCommon.TypeDate,
    documents: Type.Object({
        idCard: Type.String(),
        passport: Type.Optional(Type.String()),
    }),
    tags: Type.Array(Type.String()),
    mainAddress: CustomerAddress,
    addresses: Type.Array(CustomerAddress),
    lottery: Type.Tuple([Type.String(), Type.Number(), Type.Number(), Type.Number(), Type.Number(), Type.Number()]),
    statements: Type.Record(Type.String(), Type.Boolean()),
    companies: Type.Record(Type.String(), Type.String()),
})
export type Customer = Static<typeof Customer>;

export const CustomerSchema = new mongoose.Schema<Customer>(mongooseCommon.typeBoxToMongooseType(Customer), {
    collection: 'customer',
    ...mongooseCommon.DEF_SCHEMA_PARAM,
})
    .index({ code: 1 }, { unique: true })
    .index({ firstName: 1 })
    .index({ tags: 1 })

export const CustomerModel = mongoose.model('Customer', CustomerSchema);
