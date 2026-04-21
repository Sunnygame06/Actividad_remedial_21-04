/* 
    name,
    lastName,
    licenseNumber,
    email,
    password,
    phone,
    isActive,
    isVerified,
    loginAttemps,
    timeOut
*/

import { Schema, model } from "mongoose";
import { type } from "os";

const customerSchema = new Schema({
    name: {type: String},
    lastName: {type: String},
    licenseNumber: {type: Number},
    email: {type: String},
    password: {type: String},
    phone: {type: String},
    isActive: {type: Boolean},
    isVerified: {type: Boolean},
    loginAttemps: {type: Number},
    timeOut: {type: Date}
}, {
    timestamps: true,
    strict: false
})

export default model("Driver", customerSchema)