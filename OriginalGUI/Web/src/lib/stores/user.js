import { writable } from 'svelte/store';

/**
 * writable store for handling user variable.
 * @type {import('svelte/store').Writable<(null| {
 *   name: string,
 *   balance: number,
 *   avatar: number,
 *   email: string,
 *   transactions?: [{alreadyFetched: Array, currentOffset: number, isFetching: boolean}],
 *   settings: {
 *     sounds: boolean,
 *     preferedSeat: {"3max": number, "6max": number, "9max": number},
 *     showValuesInBB: boolean,
 *     adjustBetByBB: boolean,
 *     presetButtons: {preflop: {type: string, value: number, display: string}[], postflop: {type: string, value: number, display: string}[]}
 *   },
 * })>}
 */
const user = writable(null);
export default user;
