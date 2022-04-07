import * as mongoose from 'mongoose';

import { MixedCustomerSchema, MixedCustomer } from '../mongo/MixedCustomer';

export const mixedCustomerController = (conn: mongoose.Connection) => {
    const MixedCustomerModel = conn.model<MixedCustomer>('MixedCustomer', MixedCustomerSchema);

    return {
        getAllMixedCustomers: (session?: mongoose.ClientSession) => {
            return MixedCustomerModel
                .find()
                .session(session || null)
                .exec();
        },

        addMixedCustomerNew: (code: string, session?: mongoose.ClientSession) => {
            const mixedCustomer = new MixedCustomerModel();
            mixedCustomer.code = code;
            mixedCustomer.firstName = 'Balázs';
            mixedCustomer.addresses.push(
                { code: 'A1', zip: '7624', city: 'Pécs' },
                { code: 'A2', zip: '2021', city: 'Dunakeszi', address: 'Mellék utca 198.' },
            )
            return mixedCustomer.save({ session: session });
        },

        addMixedCustomerLegacy: (code: string, session?: mongoose.ClientSession) => {
            const mixedCustomer = new MixedCustomerModel();
            mixedCustomer.code = code;
            mixedCustomer.firstName = 'Balázs';
            mixedCustomer.mainAddress = { code: 'A0', zip: '7624', city: 'Pécs', };
            return mixedCustomer.save({ session: session });
        },

        deleteAllMixedCustomer: (session?: mongoose.ClientSession) => {
            return MixedCustomerModel
                .deleteMany()
                .session(session || null);
        },

    }
}
