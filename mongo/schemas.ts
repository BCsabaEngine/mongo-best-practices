import { Static, TSchema, TString, Type } from '@sinclair/typebox'

import * as mongoose from 'mongoose';
import { typeBoxToMongooseType } from '../util';

const DEF_COLLATION = {
    locale: 'hu',
    caseLevel: true,
    numericOrdering: true
}
const DEF_SCHEMA_PARAM = {
    autoCreate: true,
    autoIndex: true,
    collation: DEF_COLLATION,
    timestamps: true,

    minimize: false,
}

export const DateKind = Symbol("DateKind");
export interface TDate extends TSchema { type: "string"; $static: Date; kind: typeof DateKind }
export const TypeDate = Type.String({ format: "date-time" }) as TString | TDate;

export const Customer = Type.Object({
    firstName: Type.String(),
    lastName: Type.String(),
    touch: Type.Object({
        firstSeen: TypeDate,
        modifyAt: TypeDate,
    })
})
export type Customer = Static<typeof Customer>;

export const CustomerSchema = new mongoose.Schema<Customer>(typeBoxToMongooseType(Customer), {
    collection: 'customer',
    ...DEF_SCHEMA_PARAM,
});
