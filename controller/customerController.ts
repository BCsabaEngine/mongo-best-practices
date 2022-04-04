import * as mongoose from 'mongoose';

import { CustomerSchema, Customer } from '../mongo/schemas';

export const customerController = (conn: mongoose.Connection) => {
    const CustomerModel = conn.model<Customer>('Customer', CustomerSchema);

    return {
        getAllCustomer: async () => {
            return CustomerModel.find().exec();
        },

        deleteAllCustomer: async () => {
            return CustomerModel.deleteMany().exec();
        },

        addCustomer: () => {
            const customer = new CustomerModel();
            customer.firstName = 'Balázs';
            customer.lastName = 'Csaba'
            customer.touch = {
                firstSeen: Date(),
                modifyAt: Date(),
            }
            return customer.save();
        },
    }
}
