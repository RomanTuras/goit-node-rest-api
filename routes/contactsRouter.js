import express from "express";
import contactsController from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import {createContactSchema, updateContactSchema, updateFavoriteSchema} from "../schemas/contactsSchemas.js";
import authenticate from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsController.listContacts);

contactsRouter.get("/:contactId", contactsController.getContactById);

contactsRouter.delete("/:contactId", contactsController.removeContact);

contactsRouter.post("/", validateBody(createContactSchema), contactsController.createContact);

contactsRouter.put("/:contactId", validateBody(updateContactSchema), contactsController.updateContact);

contactsRouter.patch("/:contactId/favorite", validateBody(updateFavoriteSchema), contactsController.updateContact);

export default contactsRouter;
