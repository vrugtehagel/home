document.addEventListener('DOMContentLoaded', function(){
	// set intro svg to right time
	(() => {
		const setTime = () => {
			const date = new Date();
			const hours = date.getHours();
			const minutes = date.getMinutes();
			const t = (hours * 60 + minutes) / 720;
			const time = t < 1 ? 1 - t : t - 1;
			const svg = document.querySelector('#intro svg');
			svg.style.setProperty('--time', time);
		};
		setTime();
		setInterval(setTime, 60000);
	})();
});