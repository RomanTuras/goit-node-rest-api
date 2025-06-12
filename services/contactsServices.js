import Contact from "../db/Contact.js";

/**
 * Getting a list of contacts
 *
 * @returns {Promise<Array|null>}
 */
export const listContacts = () => Contact.findAll();



/**
 * Getting contact by ID
 *
 * @param {string} contactId
 * @returns {Promise<Object|null>}
 */
export const getContactById = contactId => Contact.findByPk(contactId);


/**
 * Removing contact by ID
 *
 * @param {string} contactId
 * @returns {Promise<Object|null>}
 */
export const removeContact = async contactId => {
    const contact = await getContactById(contactId);
    if (!contact) return null;

    await contact.destroy();
    return contact;
}

/**
 * Adding contact
 *
 * @returns {Promise<Object>}
 * @param payload
 */
export const addContact = payload => Contact.create(payload);


/**
 * Updating contact
 *
 * @param {string} contactId
 * @param data
 * @returns {Promise<Object> || null}
 */
export const updateStatusContact = async (contactId, data) => {
    const contact = await getContactById(contactId);
    if (!contact) return null;

    contact.update(data);

    return contact;
}
