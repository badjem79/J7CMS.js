![J7CMS.js Logo](https://raw.githubusercontent.com/badjem79/j7lab/gh-pages/images/J7CMS.js.logo.jpg)

J7CMS.js is fully client-side, Javascript site generator in the spirit of [Jekyll](https://github.com/jekyll/jekyll)
that uses plain ol' HTML, CSS and Javascript to generate your website. J7CMS.js is like a file-based CMS.
It comes from the idea of cdmedia [CMS.js](https://github.com/cdmedia/cms.js) and get improved in various ways.
It takes your content, renders Markdown and delivers a complete website in Single-Page
App fashion...without the aid of server-side scripting (no Node.js, PHP, Ruby, etc.).

![J7CMS.js Screenshot](https://raw.githubusercontent.com/badjem79/j7lab/gh-pages/images/J7CMS.js.printscreen.jpg)



## Demo

Check out a working [demo here](http://j7lab.xyz/)


## Quick Start

J7CMS.js currently supports two website modes, Github and local(Apache).

**Github Mode**

This is the default mode for J7CMS.js. Host your website on Github using
Github Pages, similar to Jekyll.

**Local (Apache) Mode**

Use a webserver like Apache if you choose to self host your content. If you choose this option,
*make sure htaccess is enabled*.

**Install**

1. Clone the repo: `git clone https://github.com/badjem79/J7CMS.js/`
2. Configure `js/config.js` to your liking
3. Make sure to set your `githubUserSettings` in `js/config.js` if using Github mode
4. If using Github mode, create a new branch from your master called `gh-pages`
   (Github's default branch for hosting)
5. Set the disqus account in `js/config.js`
6. Create or upload some page
7. Visit your site!


## How it works

**Github Mode**

In Github mode, J7CMS.js uses the Github API to get the content of your gh-pages repo
and serve them as a full website.

**Apache Mode**

In Apache mode, J7CMS.js takes advantage of Apache's Directory Indexing feature. By allowing indexes,
J7CMS.js sends an AJAX call to your specified folders and looks for Markdown files.
After they are found, it takes care of everything else and delivers a full website.


## Migration from Jekyll

**Importing Posts**

Once J7CMS.js is installed and running, simply copy all of your posts from your Jekyll
project's `_post` folder to your designated J7CMS.js posts folder.

**Importing Pages**

Copy all of your Markdown pages from your Jekyll projects root folder into your designated
J7CMS.js pages folder.


## Thanks!

* [cdmedia](https://github.com/cdmedia/)
* [jQuery](https://jquery.com/)
* [BlackrockDigital](https://github.com/BlackrockDigital) (clean blog is the *Default Theme*)
* [showdownjs](https://github.com/showdownjs/showdown)


## Contributing

All forms of contribution are welcome: bug reports, bug fixes, pull requests and simple suggestions.
If you do wish to contribute,
please follow the [Airbnb Javascript Style Guide](https://github.com/airbnb/javascript/tree/master/es5) as I don't know if I did...Thanks!