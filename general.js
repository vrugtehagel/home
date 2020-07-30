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
			document.body.classList.toggle('dark', time >= .6);
		};
		setTime();
		setInterval(setTime, 60000);
	})();

	// set cave entering
	(() => {
		const caveEntrance = document.getElementById('cave-entrance');
		const getThreshold = () => caveEntrance.offsetTop + caveEntrance.offsetHeight - window.innerHeight * 1.2;
		let queued = false;
		window.addEventListener('scroll', event => {
			if(queued) return;
			queued = true;
			requestAnimationFrame(() => {
				const threshold = getThreshold();
				let size = (window.scrollY - threshold) / window.innerHeight;
				size = size < 0 ? 0 : size > 1 ? 1 : size;
				caveEntrance.style.setProperty('--size', size);
				queued = false;
			});
		});
	})();

	// set message sending
	(() => {
		const contact = document.getElementById('contact');
		const button = document.querySelector('#letter button');
		button.addEventListener('click', () => {
			const message = document.querySelector('#letter textarea').value;
			if(!message) return;
			fetch('php/send-message.php', {
				method: 'POST',
				headers: {'Content-type': 'application/x-www-form-urlencoded'},
				body: 'name=anon&message=' + message
			});
			contact.classList.add('sending');
			setTimeout(() => document.querySelector('#letter textarea').value = '', 1000);
			setTimeout(() => contact.classList.remove('sending'), 3500);
		});
	})();

	// set email address
	(() => {
		const email = document.querySelector('footer span');
		email.textContent = 'vrugtehagel' + '@gmail.com';
	})();
});