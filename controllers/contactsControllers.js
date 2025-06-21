import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import controllerWrapper from "../helpers/controllerWrapper.js";

const listContacts = async (req, res) => {
    const {id} = req.user;
    const result = await contactsService.listContacts({owner: id});

    res.json(result);
};

const getContactById = async (req, res) => {
    const {contactId} = req.params;
    const {id} = req.user;
    const result = await contactsService.getContactById({contactId: contactId, owner: id});

    if (!result) {
        throw HttpError(404);
    }

    res.json(result);
};

const removeContact = async (req, res) => {
    const {contactId} = req.params;
    const {id} = req.user;
    const result = await contactsService.removeContact({contactId: contactId, owner: id});

    if (!result) {
        throw HttpError(404);
    }

    res.json(result);
};

const createContact = async (req, res) => {
    const result = await contactsService.addContact({...req.body, owner: req.user.id});

    res.status(201).json(result);
};

const updateContact = async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        throw HttpError(400, "Body must have at least one field");
    }

    const {id} = req.params;
    const {owner} = req.user;
    const result = await contactsService.updateContact({id, owner}, req.body);

    if (!result) {
        throw HttpError(404);
    }

    res.json(result);
};

export default {
    listContacts: controllerWrapper(listContacts),
    getContactById: controllerWrapper(getContactById),
    removeContact: controllerWrapper(removeContact),
    createContact: controllerWrapper(createContact),
    updateContact: controllerWrapper(updateContact),
};
