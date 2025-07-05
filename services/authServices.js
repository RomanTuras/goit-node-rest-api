import bcrypt from "bcrypt";

import User from "../db/User.js";

import { nanoid } from "nanoid";

import HttpError from "../helpers/HttpError.js";

import { createToken } from "../helpers/jwt.js";
import sendEmail from "../helpers/sendEmail.js";

const {APP_DOMAIN} = process.env;

export const findUser = query => User.findOne({
    where:  query,
})

const createVerifyEmail = ({email, verificationToken}) => ({
    to: email,
    subject: "Verify email",
    html: `<a href="${APP_DOMAIN}/api/auth/verify/${verificationToken}" target="_blank">Click verify email</a>`,
})

export const registerUser = async payload => {
    const hashPassword = await bcrypt.hash(payload.password, 10);
    const verificationToken = nanoid();
    const user = await User.create({...payload, password: hashPassword, verificationToken});

    const verifyEmail = createVerifyEmail({email: payload.email, verificationToken});

    await sendEmail(verifyEmail);

    return user;
}

export const verifyUser = async verificationToken => {
    const user = await findUser({verificationToken});
    if(!user) throw HttpError(404, "User not found");

    user.update({verify: true, verificationToken: null});
}

export const resendVerifyUser = async email => {
    const user = await findUser({email});
    if(!user) throw HttpError(404, "User not found");
    if(user.verify) throw HttpError(400, "Verification has already been passed");

    const verifyEmail = createVerifyEmail({email, verificationToken: user.verificationToken});

    await sendEmail(verifyEmail);
}

export const loginUser = async ({email, password})=> {
    const user = await findUser({email});
    if(!user) throw HttpError(401, "Email or password is wrong");

    if (!user.verify) throw HttpError(404, "User not found");

    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) throw HttpError(401, "Email or password is wrong");

    const payload = {
        id: user.id,
    };

    const token = createToken(payload);
    user.token = token;
    await user.save();

    return {
        token,
        "user": {
            email: user.email,
            subscription: user.subscription,
        }
    };
}

export const logoutUser = async ({email})=> {
    const user = await findUser({email});
    if(!user) throw HttpError(401, "User not found");
    user.token = "";
    await user.save();
}

export const updateUser = async (email, payload)=> {
    const user = await findUser({email});
    if(!user) throw HttpError(404, "User not found");
    await user.update(payload);
}
