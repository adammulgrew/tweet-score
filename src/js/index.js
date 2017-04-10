import './polyfills';
import CONSTANTS from './constants';

const onDOMContentLoadedTasks = [
	() => {
		if(!document.querySelector(CONSTANTS.SEARCH.SELECTOR.INPUT)) return;

		[].slice.call(document.querySelectorAll(CONSTANTS.SEARCH.SELECTOR.INPUT)).forEach(el => {
			el.addEventListener('submit', e => {
				window.setTimeout(() => {
					document.querySelector(CONSTANTS.SEARCH.SELECTOR.BODY).innerHTML = '<div class="is--searching"><img src="/img/loading-balls.gif"></div>';
				}, 10);
			});
		});
	}
];
if('addEventListener' in window) window.addEventListener('DOMContentLoaded', () => { onDOMContentLoadedTasks.forEach((fn) => fn()); });
