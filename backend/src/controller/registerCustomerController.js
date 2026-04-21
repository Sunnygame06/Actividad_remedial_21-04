import nodemailer from "nodemailer"
import crypto from "crypto"
import jsonwebtoken from "jsonwebtoken"
import bryptjs from "bcryptjs"
import {config} from "../../config.js"

import customerModel from "../models/customers.js"

const registerCustomerController = {};

registerCustomerController.register = async (req, res) => {
    try {
        const {
            name,
            lastName,
            email,
            password,
            phone,
            address,
            isVerified,
            loginAttemps,
            timeOut} = req.body;

            const exitsCustomer = await customerModel.findOne({email});
            if(exitsCustomer){
                return res.status(400).json({message: "Customer already exists"})
            }

            const passwordHashed = await bcryptjs.hash(password, 10)

            const randomCode = crypto.randomBytes(3).toString("hex")

            const token = jsonwebtoken.sign(
                {
                    name,
                    lastName,
                    email,
                    password: passwordHashed,
                    phone,
                    address,
                    isVerified,
                    loginAttemps,
                    timeOut
                },
                config.JWT.secret,
                {expiresIn: "15m"}
            );

            res.cookie("registrationCookie", token, {maxAge: 15 * 60 * 1000})

            const Transporter = nodemailer.createTransport ({
                service: "gmail",
                auth: {
                    user: config.email.user_email,
                    pass: config.email.user_password
                },
            });

            const mailOptions = {
                from: config.email.user_email,
                to: email,
                subject: "Verificacion de cuenta",
                text: "Para verificar tu cuenta, utiliza este codigo "+
                randomCode +" expira en 15 minutos"
            };

            Transporter.sendMail(mailOptions, (error, info)=>{
                if(error){
                    console.log("error"+error)
                    return res.status(500).json({message: "Error sending email"})
                }

                return res.status(200).json({message: "Email sent"})
            })
    } catch(error){
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

registerCustomerController.verifyCode = async (req, res) => {
    try {
        const {verificationCodeRequest} = req.body;

        const token = req.cookies.registrationCookie

        const decoded = jsonwebtoken.verify(token, config.JWT.secret);

        const{
            randomCode: storedCode,
            name,
            lastName,
            email,
            password,
            phone,
            address,
            isVerified,
            loginAttemps,
            timeOut
        } = decoded

        if(verificationCodeRequest !== storedCode){
            return res.status(400).json({message: "Invalid Code"})
        }

        const newCustomer = customerModel({
            name, lastName, birthdate, email, password, isVerified: true,
        });

        await newCustomer.save();

        res.clearCookie("registrationCookie")

        return res.status(200).json({message: "Customer registered"})

    } catch (error) {
        console.log("error"+error)
        return res.status(500).json({message: "Internal server error"})
    }
};

export default registerCustomerController;