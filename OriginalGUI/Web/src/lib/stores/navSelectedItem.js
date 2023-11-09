import { writable } from 'svelte/store';

const navSelectedItem = writable('lobby');
export default navSelectedItem;
