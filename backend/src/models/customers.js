/* 
    name
    lastName
    email
    password
    phone
    address
    isVerified
    loginAttemps
    timeOut
*/

import { Schema, model } from "mongoose";

const customerSchema = new Schema({
    name: {type: String},
    lastName: {type: String},
    email: {type: String},
    password: {type: String},
    phone: {type: String},
    address: {type: String},
    isVerified: {type: Boolean},
    loginAttemps: {type: Number},
    timeOut: {type: Date}
}, {
    timestamps: true,
    strict: false
})

export default model("Customer", customerSchema)