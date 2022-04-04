import * as mongoose from 'mongoose';

import { CustomerSchema } from './schemas'

export const CustomerModel = mongoose.model('Customer', CustomerSchema);
