document.addEventListener('DOMContentLoaded', function(){
	// set intro svg to right time
	(() => {
		const setTime = () => {
			const date = new Date();
			const hours = date.getHours();
			const minutes = date.getMinutes();
			const t = (hours * 60 + minutes) / 720;
			const time = t < 1 ? 1 - t : t - 1;
			document.body.style.setProperty('--time', time);
		};
		setTime();
		setInterval(setTime, 60000);
	})();

	// set cave entering
	(() => {
		const caveEntrance = document.getElementById('cave-entrance');
		const getThreshold = () => caveEntrance.offsetTop + caveEntrance.offsetHeight - window.innerHeight;
		window.addEventListener('scroll', event => {
			const threshold = getThreshold();
			let size = (window.scrollY - threshold) / (window.innerHeight * 1.3);
			size = size < 0 ? 0 : size > 1 ? 1 : size;
			caveEntrance.style.setProperty('--size', size);
		});
	})();
});