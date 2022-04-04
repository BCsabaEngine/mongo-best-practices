import * as mongoose from 'mongoose';

import { customerController } from './controller/customerController';

async function start() {
    const options = {
        bufferCommands: false,
        autoIndex: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 2000,
        socketTimeoutMS: 15000,
        family: 4,
        keepAlive: true,
        keepAliveInitialDelay: 30000,
    };

    let conn = await mongoose.createConnection('mongodb://root:password@mongodb5-replica-0.mongodb5-replica-headless:27017/', options).asPromise();
    conn = conn.useDb('expert');

    const ctrl = customerController(conn);
    {
        await ctrl.deleteAllCustomer();

        for (let i = 0; i < 100; i++)
            await ctrl.addCustomer();

        const customers = await ctrl.getAllCustomer();
        const last = customers.pop();
        console.log([
            customers.length,
            last,
            last?.touch.firstSeen,
            last?.touch.firstSeen.constructor.name,
            last.createdAt.constructor.name,
        ]);

    }
    //conn.close();
}

start();
