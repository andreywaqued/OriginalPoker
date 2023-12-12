import { activeSlot } from '$lib/stores/tabs';
import { user } from '$lib/stores/user';
import type { User } from '$lib/types/User';

let USER: User;
user.subscribe((user) => {
	if (user) USER = user;
});

let isSwiping = false;
let startTouchX = 0;

export function handleSwipe(event: TouchEvent, id: string) {
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
				activeSlot.set(keys[i - 1]);
				isSwiping = false;
			} else if (deltaX < -PIXELS_NEEDED) {
				// return if is the last item or is already swiped
				if (i === keys.length - 1 || !isSwiping) return;
				event.target.style.transform = 'none';
				console.log('Swiped right to id: ', keys[i + 1]);
				// event.target.style.transform = `translateX(${-i * 100}%)`
				activeSlot.set(keys[i + 1]);
				isSwiping = false;
			}
			break;
		case 'touchend':
			event.target.style.transform = 'none';
			isSwiping = false;
			break;
	}
}
