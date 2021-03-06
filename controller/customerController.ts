import * as mongoose from 'mongoose';

import { CustomerSchema, Customer } from '../mongo/Customer';

export const customerController = (conn: mongoose.Connection) => {
    const CustomerModel = conn.model<Customer>('Customer', CustomerSchema);

    return {
        getAllCustomers: (session?: mongoose.ClientSession) => {
            return CustomerModel
                .find()
                .session(session || null)
                .exec();
        },

        getFemalesCustomers: (session?: mongoose.ClientSession) => {
            return CustomerModel
                .find({ isFemale: true })
                .session(session || null)
                .exec();
        },

        deleteAllCustomer: (session?: mongoose.ClientSession) => {
            return CustomerModel
                .deleteMany()
                .session(session || null);
        },

        addCustomer: (code: string, session?: mongoose.ClientSession) => {
            const customer = new CustomerModel();
            customer.code = code;
            customer.firstName = 'Balázs';
            //customer.lastName = 'Csaba'
            customer.isFemale = Math.random() < 0.5;
            customer.documents = {
                idCard: 'AH123456',
            }
            customer.tags.push('customer', 'supplier', code);
            customer.mainAddress = { code: 'A0', zip: '7624', city: 'Pécs', };
            customer.addresses.push(
                { code: 'A1', zip: '7624', city: 'Pécs' },
                { code: 'A2', zip: '2021', city: 'Dunakeszi', address: 'Mellék utca 198.' },
            )
            customer.lottery = ['heti', 12, 23, 34, 45, 56];
            customer.statements = {
                'birth certificate': true,
                'mariage certificate': false,
            }
            const comp = {
                'A Kft': '8746F',
                'B Zrt': 'FA88hH',
            }
            customer.systemCodes = {
                'MOL': 'mK_as',
                'OTP': 'Alfa123',
                'MÁV': 'Kkjj57dHJöőJ',
                ...comp,
            }
            return customer.save({ session: session });
        },

        addCustomerInline: (code: string, session?: mongoose.ClientSession) => {
            return CustomerModel.insertMany({
                code,
                firstName: 'Balázs',
                lastName: 'Csaba',
                documents: {
                    idCard: 'AH123456',
                },
                tags: ['customer', 'supplier'],
                mainAddress: { code: 'A0', zip: '7624', city: 'Pécs' },
                addresses: [
                    { code: 'A1', zip: '7624', city: 'Pécs' },
                    { code: 'A2', zip: '2021', city: 'Dunakeszi', address: 'Mellék utca 198.' },
                ]
            }, { session: session });
        },

        addCustomerCreateInline: (code: string) => {
            return CustomerModel.create({
                code,
                firstName: 'Balázs',
                lastName: 'Csaba',
                documents: {
                    idCard: 'AH123456',
                    passport: 'SG11',
                },
                tags: ['customer', 'supplier'],
                mainAddress: { code: 'A0', zip: '7624', city: 'Pécs' },
                addresses: [
                    { code: 'A1', zip: '7624', city: 'Pécs' },
                    { code: 'A2', zip: '2021', city: 'Dunakeszi', address: 'Mellék utca 198.' },
                ]
            });
        },

        addCustomerTags(code: string, tags: string | string[], session?: mongoose.ClientSession) {
            if (!Array.isArray(tags))
                tags = [tags];
            return CustomerModel.updateOne(
                { code: code },
                { $push: { tags: { $each: tags } } },
                { session: session });
        }
    }
}
