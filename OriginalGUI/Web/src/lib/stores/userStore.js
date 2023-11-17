import { writable } from 'svelte/store';

/**
 * @typedef {Object} User
 * @property {string} name
 * @property {number} balance
 * @property {number} avatar
 * @property {string} email
 * @property {Settings} settings
 * @property {Transaction[]} [transactions]
 * @property {Object} players
 */

/**
 * @typedef {Object} Settings
 * @property {boolean} sounds
 * @property {PreferredSeats} preferedSeats
 * @property {boolean} showValuesInBB
 * @property {boolean} adjustBetByBB
 * @property {PresetButton[]} presetButtons
 */

/**
 * @typedef {Object} PreferredSeats
 * @property {"3max"} number
 * @property {"6max"} number
 * @property {"9max"} number
 */

/**
 * @typedef {Object} PresetButton
 * @property {Preflop[]} preflop
 * @property {Postflop[]} postflop
 */

/**
 * @typedef {Object} Preflop
 * @property {string} type
 * @property {number} value
 * @property {string} display
*/

/**
 * @typedef {Object} Postflop
 * @property {string} type
 * @property {number} value
 * @property {string} display
*/

/**
 * @typedef {Object} Transaction
*/

/**
 * writable store for handling user variable.
 * @type {import('svelte/store').Writable<(null| User)>}
 */
const user = writable(null);
export default user;
