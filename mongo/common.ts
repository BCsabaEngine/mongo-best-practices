import { TNumber, TSchema, Type } from '@sinclair/typebox'

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
    timestamps: true,

    minimize: false,
}

export const typeBoxToMongooseType = (type: any): object => {
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
        if (type.kind && (type.kind as Symbol) && (type.kind as Symbol).description == 'RecordKind') {
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
        else {
            cleanObj(type);
            const properties = type.properties;
            for (const pkey of Object.keys(properties)) {
                const kvalue = properties[pkey];
                if (kvalue.type == 'object')
                    properties[pkey] = typeBoxToMongooseType(kvalue);
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