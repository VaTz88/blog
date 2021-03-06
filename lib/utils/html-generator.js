const getMetaTags = require('./meta-tags');
const { styleHash, scriptHash } = require('./file-hash');

// Import components
const header = require('../components/header');
const footer = require('../components/footer');

module.exports = function(options) {
	const title = options.title ? `<title>${options.title}</title>` : '';

	const favicon = `<link rel="icon" href="/static/media/favicon.png">`;

	const lang = options.lang || 'en';

	let script = [`/static/js/script.js?v=${scriptHash}`];
	if (options.script) {
		options.script.forEach(function(el) {
			script.push(el);
		});
	}
	script = (function(scriptArr) {
		const arr = [];
		scriptArr.forEach(function(el) {
			arr.push(`<script src="${el}"></script>`);
		});
		return arr.join('');
	})(script);

	let css = [`/static/css/style.css?v=${styleHash}`];
	if (options.css) {
		options.css.forEach(function(el) {
			css.push(el);
		});
	}
	css = (function(cssArr) {
		const arr = [];
		cssArr.forEach(function(el) {
			arr.push(`<link rel="stylesheet" href="${el}">`);
		});
		return arr.join('');
	})(css);

	const meta = getMetaTags(
		options.title,
		options.description,
		options.meta,
		!options.enableDisqus, // only home has enableDisqus false
	);

	let head = options.head || '';
	head +=
		'<link rel="icon" sizes="192x192" href="/static/media/icon_192x192.png">';

	let body = options.body || '';
	if (options.enableDisqus && process.env.NODE_ENV !== 'development') {
		const disqus = `<div id="disqus_thread"></div>
        <script>
        var disqus_config = function () {
        this.page.url = "https://blog.vatz88.in/${options.title
					.split(' ')
					.join('-')}/";
        this.page.identifier = "${options.page_identifier}";
        };
        (function() {
        var d = document, s = d.createElement('script');
        s.src = 'https://blog-by-vatsal-joshi.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
        })();
        </script>`;

		body += disqus;
	}

	const GOOGLE_ANALYTICS = `<script async src="https://www.googletagmanager.com/gtag/js?id=UA-75111209-4"></script><script>window.dataLayer = window.dataLayer || [];function gtag() {dataLayer.push(arguments)};gtag('js', new Date());gtag('config', 'UA-75111209-4');</script>`;

	// const sentry = `<script src="https://browser.sentry-cdn.com/5.5.0/bundle.min.js" integrity="sha384-/kLYKYxlMDI1l+lhDHECQrq1Z4fnk/A32MWVF6rRnuE2WiOuAmg3wr3McNOG3Szi" crossorigin="anonymous"></script>`;

	return `<!doctype html>
        <html lang="${lang}">
        <head>
        	<meta charset="utf-8">
       		${favicon}
        	${title}
        	${meta}
        	${head}
			<link rel="dns-prefetch" href="https://www.google-analytics.com">
			<link rel="dns-prefetch" href="https://blog-by-vatsal-joshi.disqus.com">
        	${css}
        </head>
        <body>
        	${GOOGLE_ANALYTICS}
        	${header}
        	<main>
        		<!--split-->
        	</main>
        	${body}
        	${footer}
        	${script}
        </body>
        </html>`;
};
