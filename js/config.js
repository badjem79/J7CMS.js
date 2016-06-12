$(function() {

	CMS.init({

		// Name of your site or location of logo file ,relative to root directory (img/logo.png)
		siteName: 'J7Lab',

		// Tagline for your site
		siteTagline: 'Dev & Games',

		// Email address
		siteEmail: 'badjem79@gmail.com',

		// Name
		siteAuthor: 'Fabio Gemesio',

		// Navigation items
		siteNavItems: [
			/*{ name: 'Shop', href: './store/', newWindow: false},*/
			{ name: 'Chi Sono', href: '#page/chisono', newWindow: false},
			{ name: 'About', href: '#page/about', newWindow: false},
			{ name: 'Blog', href: '#posts', newWindow: false},
			{ name: "categorie", dropdown: [
				{name: 'Giochi', href: '#tag/games', newWindow: false},
				{name: 'Sviluppo', href: '#tag/sviluppo', newWindow: false}
			]}
		],

		//set the raw url of the navigation json to use instead of siteNavItems config array
		remoteNavigation: "https://raw.githubusercontent.com/badjem79/j7lab/gh-pages/navigation.json",

		// Posts folder name
		postsFolder: 'posts',

		// Homepage posts snippet length
		postSnippetLength: 120,

		// Pages folder name
		pagesFolder: 'pages',

		// Images folder name
		imagesFolder: 'images',

		// Site fade speed
		fadeSpeed: 200,

		// Site footer text
		footerText: '&copy; J7Lab ' + new Date().getFullYear() + ' All Rights Reserved.',

		// Mode 'Github' for Github Pages, 'Apache' for Apache server. Defaults
		// to Github
		mode: 'Github',

		// If Github mode is set, your Github username and repo name. Defaults
		// to Github pages branch (gh-pages)
		githubUserSettings: {
			username: 'badjem79',
			repo: 'j7lab'
		},

		defaultPage: "home",

		postRender: function() {
			if (ga) {
				ga('set', 'page', '/index.html#'+window.location.hash);
				ga('send', 'pageview');	
			} else {
				console.log("no ga loaded...");
			}
		}

	});
});
