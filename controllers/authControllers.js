import * as authServices from "../services/authServices.js";

import ctrlWrapper from "../helpers/controllerWrapper.js";

const registerController = async(req, res)=> {

    const newUser = await authServices.registerUser(req.body);

    res.status(201).json({
        "user": {
            email: newUser.email,
            subscription: newUser.subscription,
        }
    })
}

export const loginController = async(req, res)=> {
    const user = await authServices.loginUser(req.body);

    res.json({...user});
}

export const getCurrentController = async (req, res)=> {
    const {email, subscription} = req.user;

    res.json({
        email,
        subscription,
    });
}

export const logoutController = async(req, res)=> {
    await authServices.logoutUser(req.user);

    res.status(204).json({
        message: "Logout successfully"
    })
}

export default {
    registerController: ctrlWrapper(registerController),
    loginController: ctrlWrapper(loginController),
    getCurrentController: ctrlWrapper(getCurrentController),
    logoutController: ctrlWrapper(logoutController),
}
