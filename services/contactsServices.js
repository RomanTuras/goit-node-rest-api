import Contact from "../db/Contact.js";

/**
 * Getting a list of contacts
 *
 * @returns {Promise<Array|null>}
 */
export const listContacts =  (query) => Contact.findAll({
    where: query,
});



/**
 * Getting contact by ID
 *
 * @param {Object} query
 * @returns {Promise<Object|null>}
 */
export const getContactById = query => Contact.findOne(query);


/**
 * Removing contact by ID
 *
 * @param {Object} query
 * @returns {Promise<Object|null>}
 */
export const removeContact = async query => {
    const contact = await getContactById(query);
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
 * @param {Object} query
 * @param data
 * @returns {Promise<Object> || null}
 */
export const updateContact = async (query, data) => {
    const contact = await getContactById(query);
    if (!contact) return null;

    contact.update(data);

    return contact;
}
