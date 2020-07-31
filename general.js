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
		const frame = () => {
			const threshold = caveEntrance.offsetTop + caveEntrance.offsetHeight - window.innerHeight * 1.2;
			let size = (window.scrollY - threshold) / window.innerHeight;
			size = size < 0 ? 0 : size > 1 ? 1 : size;
			caveEntrance.style.setProperty('--size', size);
			requestAnimationFrame(frame);
		};
		frame();
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

	// set hall of fame clicks
	(() => {
		const posters = document.getElementById('posters').children;
		const wallOfFame = document.getElementById('wall-of-fame');
		const article = document.querySelector('#wall-of-fame article');
		let timeoutID = -1;

		const closePoster = () => {
			wallOfFame.classList.remove('poster-open');
			clearTimeout(timeoutID);
			timeoutID = setTimeout(() => {
				wallOfFame.classList.add('ready');
				for(const poster of posters) poster.classList.remove('selected');
			}, 500);
		};

		for(const poster of posters){
			poster.addEventListener('click', () => {
				if(!wallOfFame.classList.contains('ready')) return;
				event.stopPropagation();
				const name = poster.getAttribute('data-project');
				const template = poster.querySelector('template');
				// set dimensions...
				const rect = poster.getBoundingClientRect();
				const width = rect.width;
				const height = rect.height;
				const top = (rect.top || rect.x) + height / 2;
				const left = (rect.left || rect.y) + width / 2;

				article.style.setProperty('--width', width + 'px');
				article.style.setProperty('--height', height + 'px');
				article.style.setProperty('--top', top + 'px');
				article.style.setProperty('--left', left + 'px');

				while(article.firstChild) article.removeChild(article.lastChild);
				article.setAttribute('data-project', name);
				article.appendChild(template.content.cloneNode(true));
				poster.classList.add('selected');
				requestAnimationFrame(() => {
					wallOfFame.classList.remove('ready');
					requestAnimationFrame(() => {
						wallOfFame.classList.add('poster-open');
						const width = poster.offsetWidth;
						const height = poster.offsetHeight;
						article.style.setProperty('--width', width + 'px');
						article.style.setProperty('--height', height + 'px');
					});
				});
			});
		}
		document.body.addEventListener('click', event => {
			if(article.contains(event.target)) return;
			if(!wallOfFame.classList.contains('poster-open')) return;
			closePoster();
		});
	})();
});