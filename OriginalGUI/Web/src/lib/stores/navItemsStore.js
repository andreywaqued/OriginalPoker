import { writable } from 'svelte/store';

/**
 * @typedef {Object} Item
 * @property {string} id
 * @property {string} name
 * @property {Object} [data]
 */

/**
 * @typedef {Item[]} Items
 */

/**
 * @type {import('svelte/store').Writable<Items>}
 */
const navItems = writable([]);
export default navItems;
