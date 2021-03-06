import * as mongoose from 'mongoose';

// import { customerController } from './controller/customerController';
// import { mixedCustomerController } from './controller/mixedCustomerController';
import { connectionOptions } from './mongo/common';
import { User, UserSchema } from './mongo/User';
import { Role, RoleSchema } from './mongo/Role';
import { UserRole, UserRoleSchema } from './mongo/UserRole';

async function start() {
    // let conn = await mongoose.createConnection('mongodb://root:password@mongodb5-replica-0.mongodb5-replica-headless:27017/', connectionOptions).asPromise();
    // conn = conn.useDb('expert');
    let conn = await mongoose.createConnection('mongodb://root:password@mongodb5-replica-headless:27017/', connectionOptions).asPromise();
    conn = conn.useDb('reftest');

    const UserModel = conn.model<User>('user', UserSchema);
    const RoleModel = conn.model<Role>('role', RoleSchema);
    const UserRoleModel = conn.model<UserRole>('userrole', UserRoleSchema);

    let user = await UserModel.findOne({ username: 'csaba' });
    if (!user) {
        user = new UserModel();
        user.username = 'csaba';
        user.realname = 'Balázs Csaba'
        user.password = '123';
        await user.save();
    }

    let role = await RoleModel.findOne({ code: 'superadmin' });
    if (!role) {
        role = new RoleModel();
        role.code = 'superadmin';
        role.name = 'Superadmin privilege'
        role.description = 'All in one privilege';
        await role.save();
    }

    await UserRoleModel.deleteMany();

    const userrole = new UserRoleModel();
    userrole.user = user.id;
    //userrole.role = role.id;
    await userrole.save();

    const userroleRead = await UserRoleModel
        .find()
        .sort({ _id: -1 })
        .limit(2)
        .populate(['user', 'role'])
    if (userroleRead) {
        //await userroleRead.populate('user');
        //await userroleRead.populate('role');
        console.log(userroleRead);
        console.log(userroleRead.length);
    }

    // const ctrl = customerController(conn);
    // {
    //     const CUSTOMER_COUNT = 100;
    //     let customerCodeInc = 1;

    //     console.time('Delete all with tran');
    //     await conn.transaction(async (session) => {
    //         await ctrl.deleteAllCustomer(session);
    //     });
    //     await ctrl.deleteAllCustomer();
    //     console.timeEnd('Delete all with tran');

    //     console.time('Customer without tran');
    //     for (let i = 0; i < CUSTOMER_COUNT; i++) {
    //         await ctrl.addCustomer(`C_${customerCodeInc++}`);
    //     }
    //     console.timeEnd('Customer without tran');

    //     for (let i = 0; i < CUSTOMER_COUNT; i++) {
    //         await ctrl.addCustomerInline(`C_${customerCodeInc++}`);
    //         await ctrl.addCustomerCreateInline(`C_${customerCodeInc++}`);
    //     }

    //     console.time('Customer with tran');
    //     await conn.transaction(async (session) => {
    //         for (let i = 0; i < CUSTOMER_COUNT; i++) {
    //             await ctrl.addCustomer(`C_${customerCodeInc++}`, session);

    //             if (i % (CUSTOMER_COUNT / 10) == 0) {
    //                 await session.commitTransaction();
    //                 console.log("Restart tran");
    //                 session.startTransaction();
    //             }
    //         }
    //     });
    //     console.timeEnd('Customer with tran');

    //     await ctrl.addCustomerTags('C_400', ['ext1', 'ext2']);

    //     const customers = await ctrl.getAllCustomers();
    //     console.log(`Sum: ${customers.length} customers`);
    //     const femaleCustomers = await ctrl.getFemalesCustomers();
    //     console.log(`Sum: ${femaleCustomers.length} female customers`);

    //     const last = customers.pop()?._doc;
    //     for (const c of last?.systemCodes)
    //         console.log(c);

    //     delete last.statements;
    //     delete last.systemCodes;
    //     console.dir(last, { depth: null });
    // }

    // const mCtrl = mixedCustomerController(conn);
    // {
    //     await mCtrl.deleteAllMixedCustomer();

    //     await mCtrl.addMixedCustomerLegacy('A1');
    //     await mCtrl.addMixedCustomerNew('A2');

    //     const mixedCustomers = await mCtrl.getAllMixedCustomers();
    //     console.log(`Sum: ${mixedCustomers.length} mixed customers`);
    // }
    await conn.close();
}

start();
