export const typeBoxToMongooseType = (type: any): object => {
    if (type.type == 'object') {
        const properties = type.properties;
        for (const pkey of Object.keys(properties)) {
            const kvalue = properties[pkey];
            if (kvalue.type == 'object')
                properties[pkey] = typeBoxToMongooseType(kvalue);
        }
        return properties;
    }
    return {};
}