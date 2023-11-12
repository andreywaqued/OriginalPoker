import { writable } from 'svelte/store';

/**
 * @typedef {string} ID
 */

/**
 * @type {import('svelte/store').Writable<ID>}
 */
const navSelectedItem = writable();
export default navSelectedItem;
