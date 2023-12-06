import { writable } from 'svelte/store';

export const activeSlot = writable<string>();
export const activeLobbyTab = writable<string>();
