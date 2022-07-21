import { TNumber, TSchema, TString, Type } from '@sinclair/typebox'
import * as mongoose from 'mongoose';

export const connectionOptions = {
    bufferCommands: false,
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 2000,
    socketTimeoutMS: 15000,
    family: 4,
    keepAlive: true,
    keepAliveInitialDelay: 30000,
};

const DEF_COLLATION = {
    locale: 'hu',
    caseLevel: true,
    numericOrdering: true,
}

export const DEF_SCHEMA_PARAM = {
    autoCreate: true,
    autoIndex: true,
    collation: DEF_COLLATION,
    timestamps: false,

    versionKey: false,

    minimize: false,
}

export const typeBoxToMongooseSchemaDefinition = (type: any): object => {
    const isObject = (obj: any) => (!!obj) && (obj.constructor === Object);
    const cleanObj = (obj: any) => {
        delete obj.kind;
        delete obj.required;
        if (obj.items)
            if (isObject(obj.items))
                delete obj.items.kind;
            else if (Array.isArray(obj.items))
                for (const i of obj.items)
                    delete i.kind;
    }
    if (type.type == 'object') {
        if (type.kind && (type.kind as Symbol) && (type.kind as Symbol).description == 'ObjectIdKind') {
            return { type: mongoose.Schema.Types.ObjectId, ref: type.ref, required: type.required };
        }
        else if (type.kind && (type.kind as Symbol) && (type.kind as Symbol).description == 'RecordKind') {
            if (!type.patternProperties || !type.patternProperties['^.*$'])
                throw new Error('TKey of map can be string only');
            const typeMap = type.patternProperties['^.*$'].type;
            cleanObj(type);
            switch (typeMap) {
                case 'number':
                    return { type: Map, of: Number }
                case 'string':
                    return { type: Map, of: String }
                case 'boolean':
                    return { type: Map, of: Boolean }
                default:
                    throw new Error(`Invalid TValue of map: ${typeMap}`);
            }
        }
        else if (type.kind && (type.kind as Symbol) && (type.kind as Symbol).description == 'IntersectKind') {
            const allProp: any = {};
            if (Array.isArray(type.allOf))
                for (const subType of type.allOf) {
                    const subTypeCleared = typeBoxToMongooseSchemaDefinition(subType) as any;
                    for (const pkey of Object.keys(subTypeCleared)) {
                        const kvalue = subTypeCleared[pkey];
                        if (!Object.keys(allProp).includes(pkey))
                            allProp[pkey] = kvalue;
                    }
                }
            return allProp;
        }
        else {
            cleanObj(type);
            const properties = type.properties;
            for (const pkey of Object.keys(properties)) {
                const kvalue = properties[pkey];
                if (kvalue.type == 'object')
                    properties[pkey] = typeBoxToMongooseSchemaDefinition(kvalue);
                else
                    cleanObj(properties[pkey]);
            }
            return properties;
        }
    }
    return {};
}

const DateKind = Symbol("DateKind");
export interface TDate extends TSchema { type: "date"; $static: Date; kind: typeof DateKind }
export const TypeDate = Type.Number() as TNumber | TDate;

const ObjectIdKind = Symbol("ObjectIdKind");
export interface TObjectId extends TSchema { type: "object"; $static: string; kind: typeof ObjectIdKind, ref: string }

export interface TTypeObjectId extends TString {
    ref: string;
}

export const TypeObjectId = (ref: string): TTypeObjectId | TObjectId => {
    return {
        type: "object",
        kind: ObjectIdKind,
        $static: 'String',
        ref: ref
    };
}

