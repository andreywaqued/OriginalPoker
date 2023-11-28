import navSelectedItemStore from '$lib/stores/navSelectedItemStore';
import userStore from '$lib/stores/userStore';

/** @type {import('$lib/stores/userStore').User} */
let USER;
userStore.subscribe((user) => {
	if (user) USER = user;
});

/** @type {boolean} */
let isSwiping = false;
/** @type {number} */
let startTouchX = 0;
/**
 * @param {TouchEvent} event
 * @param {string} id
 */
export function handleSwipe(event, id) {
	// pixels needed to toogle the swipe
	const PIXELS_NEEDED = 75;
	// do nothing if players not exist
	if (!USER.players) return;
	switch (event.type) {
		case 'touchstart':
			startTouchX = event.touches[0].clientX;
			isSwiping = true;
			break;
		case 'touchmove':
			// get the object of players and current index of selectec item
			const keys = Object.keys({ lobby: {}, ...USER.players });
			const i = keys.indexOf(id);
			const currentTouchX = event.changedTouches[0].clientX;
			const deltaX = currentTouchX - startTouchX;
			event.target.style.transform = `translateX(${deltaX}px)`;
			if (deltaX > PIXELS_NEEDED) {
				// return if is the first item or is already swiped
				if (i === 0 || !isSwiping) return;
				event.target.style.transform = 'none';
				console.log('Swiped left to id: ', keys[i - 1]);
				navSelectedItemStore.set(keys[i - 1]);
				isSwiping = false;
			} else if (deltaX < -PIXELS_NEEDED) {
				// return if is the last item or is already swiped
				if (i === keys.length - 1 || !isSwiping) return;
				event.target.style.transform = 'none';
				console.log('Swiped right to id: ', keys[i + 1]);
				// event.target.style.transform = `translateX(${-i * 100}%)`
				navSelectedItemStore.set(keys[i + 1]);
				isSwiping = false;
			}
			break;
		case 'touchend':
			event.target.style.transform = 'none';
			isSwiping = false;
			break;
	}
}
