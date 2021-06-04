// set intro svg to right time
(() => {
	function setIntroTime(){
		const date = new Date();
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const time = Math.abs((hours * 60 + minutes) / 720 - 1);
		document.body.style.setProperty('--time', time);
		document.body.classList.toggle('dark', time >= .6);
	};

	setIntroTime();
	setInterval(setIntroTime, 60000);
})();

// set cave entering
(() => {
	let frameId = 0;
	const caveEntrance = document.getElementById('cave-entrance');
	const setCaveEntranceSize = () => {
		const {offsetTop, offsetHeight} = caveEntrance;
		const threshold = offsetTop + offsetHeight - window.innerHeight * 1.2;
		const offset = (window.scrollY - threshold) / window.innerHeight;
		const size = Math.max(0, Math.min(1, offset));
		caveEntrance.style.setProperty('--size', size);
		frameId = 0;
	};
	setCaveEntranceSize();
	window.addEventListener('scroll', () => {
		if(frameId) return;
		frameId = requestAnimationFrame(setCaveEntranceSize);
	});
})();

// set message sending
(() => {
	const contact = document.getElementById('contact');
	const button = document.querySelector('#letter button');
	const textarea = document.querySelector('#letter textarea');
	button.addEventListener('click', () => {
		const message = textarea.value;
		if(!message) return;
		fetch('php/send-message.php', {
			method: 'POST',
			headers: {'Content-type': 'application/x-www-form-urlencoded'},
			body: 'name=anon&message=' + message
		});
		contact.classList.add('sending');
		setTimeout(() => textarea.value = '', 1000);
		setTimeout(() => contact.classList.remove('sending'), 3500);
	});
})();

// set email address
(() => {
	const email = document.getElementById('email');
	email.textContent = 'vrugtehagel' + '@gmail.com';
})();

// set hall of fame clicks
(() => {
	const posters = document.getElementById('posters').children;
	const wallOfFame = document.getElementById('wall-of-fame');
	const article = document.querySelector('#wall-of-fame article');
	let timeoutID = -1;

	const closePoster = () => {
		const content = article.querySelector('.poster-content');
		wallOfFame.classList.remove('poster-open');
		content.classList.remove('scrolling');
		document.body.classList.remove('no-scroll');
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
			const name = poster.dataset.project;
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

			document.body.classList.add('no-scroll');

			article.replaceChildren();
			article.setAttribute('data-project', name);
			article.appendChild(template.content.cloneNode(true));
			poster.classList.add('selected');

			const back = article.querySelector('.back');
			back.addEventListener('click', closePoster);

			const content = article.querySelector('.poster-content');
			content.addEventListener('scroll', event => {
				const top = content.scrollTop;
				content.classList.add('scrolling');
				content.style.setProperty('--scroll', top + 'px');
			});
			content.style.setProperty('--scroll', '0px');
			content.scrollTo(0, 0);

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
