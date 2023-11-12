import { writable } from 'svelte/store';

/**
 * @typedef {{
 *   id: string,
 *   name: string,
 *   data?: {},
 * }} Item
 *
 * @typedef {Item[]} Items
 */

/**
 * @type {import('svelte/store').Writable<Items>}
 */
const navItems = writable([]);
export default navItems;
