import navSelectedItemStore from '$lib/stores/navSelectedItemStore';
import userStore from '$lib/stores/userStore';

/** @type {import('$lib/stores/userStore').User} */
let USER;
userStore.subscribe((user) => {
	if (user) USER = user;
});

/** @type {number} */
let startTouchX = 0;
/**
 * @param {TouchEvent} event
 * @param {string} id
 */
export function handleSwipe(event, id) {
	// do nothing if players not exist
	if (!USER.players) return;
	switch (event.type) {
		case 'touchstart':
			startTouchX = event.touches[0].clientX;
			break;
		case 'touchmove':
			const keys = Object.keys({ lobby: {}, ...USER.players });
			const i = keys.indexOf(id);
			const currentTouchX = event.changedTouches[0].clientX;
			const deltaX = currentTouchX - startTouchX;
			if (deltaX > 50) {
				// return if is the last item
				if (i === 0) return;
				console.log('Swiped left to id: ', keys[i - 1]);
				navSelectedItemStore.set(keys[i - 1]);
			} else if (deltaX < -50) {
				// return if is the first item
				if (i === keys.length - 1) return;
				console.log('Swiped right to id: ', keys[i + 1]);
				navSelectedItemStore.set(keys[i + 1]);
			}
			break;
	}
}
