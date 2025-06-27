import * as authServices from "../services/authServices.js";
import gravatar from "gravatar";
import ctrlWrapper from "../helpers/controllerWrapper.js";
import {rename} from "node:fs/promises";
import {resolve, join} from "node:path";

const avatarDir = resolve("public", "avatars");

const registerController = async(req, res)=> {
    req.body.avatarUrl = gravatar.url(req.body.email, {protocol: 'http', s: '100'});
    const newUser = await authServices.registerUser(req.body);

    res.status(201).json({
        "user": {
            email: newUser.email,
            subscription: newUser.subscription,
            avatarUrl: newUser.avatarUrl,
        }
    })
}

export const loginController = async(req, res)=> {
    const user = await authServices.loginUser(req.body);

    res.json({...user});
}

export const getCurrentController = async (req, res)=> {
    const {email, subscription, avatarUrl} = req.user;

    res.json({
        email,
        subscription,
        avatarUrl
    });
}

export const logoutController = async(req, res)=> {
    await authServices.logoutUser(req.user);

    res.status(204).json({
        message: "Logout successfully"
    })
}

export const updateAvatarController = async(req, res)=> {
    let avatar = null;
    if (req.file) {
        const {path: oldPath, filename} = req.file;
        const newPath = join(avatarDir, filename);
        await rename(oldPath, newPath);
        avatar = join("avatars", filename);
    }
    const {email} = req.user;
    await authServices.updateUser(email, {...req.body, avatarURL: avatar});

    res.status(200).json({
        "avatarURL": avatar,
    })
}

export default {
    registerController: ctrlWrapper(registerController),
    loginController: ctrlWrapper(loginController),
    getCurrentController: ctrlWrapper(getCurrentController),
    logoutController: ctrlWrapper(logoutController),
    updateAvatarController: ctrlWrapper(updateAvatarController),
}
