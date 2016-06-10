/*
 * CMS.js v1.0.0
 * Copyright 2015 Chris Diana
 * www.cdmedia.github.io/cms.js
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 */

var CMS = {

	settings: {
		siteName: 'CMS.js',
		siteTagline: 'Your site tagline',
		siteEmail: 'your_email@example.com',
		siteAuthor: 'Your Name',
		siteUrl: '',
		requestKey: Math.random().toString(36).substring(7),
		siteNavItems: [
			{ name: 'Github', href: '#', newWindow: false},
			{ name: 'About' }
		],
		pagination: 3,
		postsFolder: 'posts',
		postSnippetLength: 120,
		pagesFolder: 'pages',
		imagesFolder: 'images',
		fadeSpeed: 300,
		numPostsPerPage: 5,
		mainContainer: $('.cms_main'),
		footerContainer: $('.cms_footer'),
		footerText: '&copy; ' + new Date().getFullYear() + ' All Rights Reserved.',
		parseSeperator: '---',
		loader: '<div class="loader">Loading...</div>',
		get siteAttributes() {
			return [
				{ attr: 'title', value: CMS.settings.siteName },
				{ attr: '.cms_sitename', value: CMS.settings.siteName},
				{ attr: '.cms_tagline', value: CMS.settings.siteTagline},
				{ attr: '.cms_footer_text', value: CMS.settings.footerText}
			];
		},
		mode: 'Github',
		remoteNavigation: false,
		defaultImage: 'home-bg.jpg',
		githubUserSettings: {
			username: 'yourusername',
			repo: 'yourrepo',
		},
		githubSettings: {
			branch: 'gh-pages',
			host: 'https://api.github.com'
		},
		defaultPage: ''
	},
	converter: new showdown.Converter(),
	posts: [],
	pages: [],
	images: [],
	loaded: {},

	extend: function (target, opts, callback) {
		var next;
		if (typeof opts === "undefined") {
			opts = target;
			target = CMS;
		}
		for (next in opts) {
			if (Object.prototype.hasOwnProperty.call(opts, next)) {
				target[next] = opts[next];
			}
		}
		callback(); // check user config options
		return target;
	},

	render: function (url) {
		CMS.settings.mainContainer.html('').fadeOut(CMS.settings.fadeSpeed);
		CMS.settings.footerContainer.hide();
		var type = url.split('/')[0];
		var ret;
		var map = {

			// Tag view
			'#tag' : function () {
				var page = 1;
				var tag;
				var posts = [];
				if(url.split('/')[1]) {
					tag = url.split('/')[1].trim().toLowerCase();
				}
				if(url.split('/')[2]) {
					page = parseInt(url.split('/')[1].trim());
				}
				CMS.posts.forEach(function(post){
					if(post.tags && post.tags.toLowerCase().indexOf(tag) >= 0){
						posts.push(post);
					}
				})
				if (posts.length > 0) {
					CMS.renderPosts(posts, page, tag);
					return true;
				} else {
					return false;
				}
				
			},

			// Main view
			'#posts' : function () {
				var page = 1;
				if(url.split('/')[1]) {
					page = parseInt(url.split('/')[1].trim());
				}
				CMS.renderPosts(CMS.posts, page);
				return true;
			},

			// Post view
			'#post' : function() {
				var id = url.split('/')[1].trim();
				CMS.renderPost(id);
				return true;
			},

			// Post view
			'#page' : function() {
				var hash = url.split('/')[1].trim();
				CMS.renderPage(hash);
				return true;
			}

		};

		if (map[type]) {
			ret = map[type]();
			if (!ret) {
				var errorMsg = 'Post Not Found.';
				CMS.renderError(errorMsg);
			}
		} else {
			var errorMsg = 'Page not found.';
			CMS.renderError(errorMsg);
		}
	},

	renderPage: function(hash) {
		CMS.pages.forEach(function(page){
			if(page.hash == hash) {

				$('title').html(CMS.settings.siteName + " - " + page.title);
				
				var tpl = $('#page-template').html(),
					$tpl = $(tpl),
					image = page.image,
					imageUrl;

				$tpl.find('.page-title').html(page.title);
				$tpl.find('.page-content').html(page.contentData);

				if (!image) {
					image = CMS.settings.defaultImage;
				}
				CMS.images.forEach(function(img){
					if(img.name == image) {
						imageUrl = img.url
					}
				});

				$tpl.find('.intro-container').parent().css('background-image','url(' + imageUrl + ')');

				if (page.subtitle) {
					$tpl.find('.page-subtitle').html(page.subtitle);
				} else {
					$tpl.find('.page-subtitle').hide();
				}

				CMS.settings.mainContainer.html($tpl).hide().fadeIn(CMS.settings.fadeSpeed);
			}
		});
		CMS.renderFooter();
	},

	renderPost: function(id) {
		CMS.posts.forEach(function(post, index){
			if(post.id == id) {
				
				$('title').html(CMS.settings.siteName + " - " + post.title);

				var tpl = $('#post-template').html(),
					$tpl = $(tpl),
					image = post.image,
					imageUrl,
					tags,
					tagString;


				if (!image) {
					image = CMS.settings.defaultImage;
				}
				CMS.images.forEach(function(img){
					if(img.name == image) {
						imageUrl = img.url;
					}
				});

				if(post.tags) {
					tagString = "Tags:";
					tags = post.tags.split(",");
					tags.forEach(function(tag){
						tag = tag.trim().toLowerCase();
						tagString += '&nbsp;<span class="label label-info"><a href="#tag/'+tag+'">'+tag+'</a></span>';
					});
					$tpl.find('.post-tags').html(tagString);
				}

				$tpl.find('.intro-container').parent().css('background-image','url(' + imageUrl + ')');

				$tpl.find('.post-title').html(post.title);
				$tpl.find('.post-date').html((post.date.getMonth() + 1) + '/' + post.date.getDate() + '/' +  post.date.getFullYear());
				$tpl.find('.post-content').html(post.contentData);

				if (post.subtitle) {
					$tpl.find('.post-subtitle').html(post.subtitle)
				} else {
					$tpl.find('.post-subtitle').hide()
				}
				
				if (post.author) {
					$tpl.find('.post-author').html(post.author);
				} else {
					$tpl.find('.post-author').html(CMS.settings.siteAuthor);
				}

				if (index == 0 && CMS.posts.length == 1) {
					$tpl.find('.pager').hide();
				} else {
					if (index == 0) {
						$tpl.find('.next').hide();
					} else {
						$tpl.find('.next a').attr('href',"#post/"+CMS.posts[index-1].id+"/"+CMS.posts[index-1].title);
					}
					if (index == CMS.posts.length-1) {
						$tpl.find('.previous').hide();
					} else {
						$tpl.find('.previous a').attr('href',"#post/"+CMS.posts[index+1].id+"/"+CMS.posts[index+1].title);
					}
				}

				var cmtString = $('#post-comments').html();

				cmtString = cmtString.replace('scr1pt',"script");
				cmtString = cmtString.replace('scr2pt',"script");
				cmtString = cmtString.replace('PAGE_IDENTIFIER', window.location.hash);
				cmtString = cmtString.replace('PAGE_URL', window.location.href );

				$tpl.find('.comments').html(cmtString);

				CMS.settings.mainContainer.html($tpl).hide().fadeIn(CMS.settings.fadeSpeed);
			}
		});
		CMS.renderFooter();
	},

	renderPosts: function(posts, page, tag) {
		var last = page * CMS.settings.numPostsPerPage;
		var first = last - CMS.settings.numPostsPerPage;
		var title = CMS.settings.siteName;
		
		if (tag) {
			title += " - Tag: " + tag;
		} else {
			title += " - Posts";
		}
		$('title').html(title);

		posts.forEach(function(post, index){
			if (index >= first && index < last) {
				var tpl = $('#post-template').html(),
					$tpl = $(tpl),
					image = post.image,
					imageUrl,
					tags,
					tagString;

				if (!image) {
					image = CMS.settings.defaultImage;
				}
				CMS.images.forEach(function(img){
					if(img.name == image) {
						imageUrl = img.url;
					}
				});
				
				if(post.tags) {
					tagString = "Tags:";
					tags = post.tags.split(",");
					tags.forEach(function(tag){
						tag = tag.trim().toLowerCase();
						tagString += '&nbsp;<span class="label label-info"><a href="#tag/'+tag+'">'+tag+'</a></span>';
					});
					$tpl.find('.post-tags').html(tagString);
				}

				$tpl.find('.intro-container').parent().css('background-image','url(' + imageUrl + ')');

				var title = '<a href="#post/' + post.id + '/' + post.title +'">' + post.title + '</a>',
					date = post.date.getDate() + '/' + (post.date.getMonth() + 1) + '/' + post.date.getFullYear(),
					snippet = post.contentData.split('.')[0] + '.';

				var postLink = $tpl.find('.post-title'),
					postSubtitle = $tpl.find('.post-subtitle'),
					postDate = $tpl.find('.post-date'),
					postAuthor = $tpl.find('.post-author'),
					postSnippet = $tpl.find('.post-content');

				if (post.subtitle) {
					postSubtitle.html(post.subtitle);
				} else {
					postSubtitle.hide();
				}

				if (post.author) {
					postAuthor.html(post.author);
				} else {
					postAuthor.html(CMS.settings.siteAuthor);
				}

				if (index == last-1 || index == posts.length-1) {
					if (page == 1) {
						$tpl.find('.next').hide();
					} else {
						if (tag) {
							$tpl.find('.next a').attr('href',"#tag/"+tag+"/"+(page-1));
						} else {
							$tpl.find('.next a').attr('href',"#posts/"+(page-1));
						}
						
					}
					if (index == posts.length-1) {
						$tpl.find('.previous').hide();
					} else {
						if (tag) {
							$tpl.find('.previous a').attr('href',"#tag/"+tag+"/"+(page+1));
						} else {
							$tpl.find('.previous a').attr('href',"#posts/"+(page+1));
						}
					}
				} else {
					$tpl.find('.pager').hide();
				}

				postLink.html(title);
				postSnippet.html(snippet);
				postDate.html(date);
				CMS.settings.mainContainer.append($tpl).hide().fadeIn(CMS.settings.fadeSpeed);
			}
		});
		CMS.renderFooter();
	},

	renderFooter: function() {
		// Load footer later so things dont look weird loading ajax stuff
		setTimeout(function () {
			CMS.settings.footerContainer.fadeIn(CMS.settings.fadeSpeed);
		}, 800);
	},

	renderError: function(msg) {
		var tpl = $('#error-template').html(),
			$tpl = $(tpl);

		$tpl.find('.error_text').html(msg);

		CMS.settings.mainContainer.html('').fadeOut(CMS.settings.fadeSpeed, function(){
			CMS.settings.mainContainer.html($tpl).fadeIn(CMS.settings.fadeSpeed);
		});
	},

	contentLoaded: function(type) {

		CMS.loaded[type] = true;

		if(CMS.loaded.page && CMS.loaded.post && CMS.loaded.image) {

			// Set navigation
			this.setNavigation();

			if (window.location.hash != "") {
				// Manually trigger on initial load
				$(window).trigger('hashchange');
			} else {
				// Load default page
				window.location.hash = 'page/' + CMS.settings.defaultPage;
			}

		}
	},

	parseContent: function(content, type, file, counter, numFiles) {

		var data = content.split(CMS.settings.parseSeperator),
			contentObj = {},
			id = file.name.replace('.md',''),
			date = file.date;

		contentObj.id = id;
		contentObj.date = date;

		// Get content info
		var infoData = data[1].split('\n');

		$.each(infoData, function(k, v) {
			if(v.length) {
				v.replace(/^\s+|\s+$/g, '').trim();
				var i = v.split(':');
				var val = i[1];
				k = i[0];
				contentObj[k] = val.trim();
			}
		});

		// Drop stuff we dont need
		data.splice(0,2);

		// Put everything back together if broken
		var contentData = data.join();
		contentObj.contentData = CMS.converter.makeHtml(contentData); //marked(contentData);


		if(type == 'post') {
			CMS.posts.push(contentObj);
		} else if (type == 'page') {
			CMS.pages.push(contentObj);
		}

		// Execute after all content is loaded
		if(counter === numFiles) {
			CMS.contentLoaded(type);
		}
	},

	getContent: function(type, file, counter, numFiles) {

		var urlFolder = '';

		switch(type) {
			case 'post':
				urlFolder = CMS.settings.postsFolder;
				break;
			case 'page':
				urlFolder = CMS.settings.pagesFolder;
				break;
			case 'image':
				urlFolder = CMS.settings.imagesFolder;
				break;
		}

		if(CMS.settings.mode == 'Github') {
			url = file.link + "?key=" + CMS.requestKey;
		} else {
			url = urlFolder + '/' + file.name;
		}

		if (type == "image") {
			CMS.images.push({
				name: file.name,
				url: file.link
			});
			// Execute after all content is loaded
			if(counter === numFiles) {
				CMS.contentLoaded(type);
			}
		} else {
			$.ajax({
				type: 'GET',
				url: url,
				dataType: 'html',
				success: function(content) {
					CMS.parseContent(content, type, file, counter, numFiles);
				},
				error: function() {
					var errorMsg = 'Error loading ' + type + ' content';
					CMS.renderError(errorMsg);
				}
			});
		}
	},

	getFiles: function(type) {

		var folder = '',
			url = '';

		switch(type) {
			case 'post':
				folder = CMS.settings.postsFolder;
				break;
			case 'page':
				folder = CMS.settings.pagesFolder;
				break;
			case 'image':
				folder = CMS.settings.imagesFolder;
				break;
		}

		if(CMS.settings.mode == 'Github') {
			var gus = CMS.settings.githubUserSettings,
				gs = CMS.settings.githubSettings;
			url = gs.host + '/repos/' + gus.username + '/' + gus.repo + '/contents/' + folder + '?ref=' + gs.branch + "&key=" + CMS.requestKey;
		} else {
			url = folder;
		}

		$.ajax({
			url: url,
			success: function(data) {

				var files = [],
					linkFiles;

				if(CMS.settings.mode == 'Github') {
					linkFiles = data;
				} else {
					linkFiles = $(data).find("a");
				}

				if (type == "post") {
					linkFiles.reverse();
				}

				$(linkFiles).each(function(k, f) {

					var filename,
						downloadLink;
					var file = {};

					if(CMS.settings.mode == 'Github') {
						filename = f.name;
						downloadLink = f.download_url;
					} else {
						filename = $(f).attr("href");
					}

					if(type == "post") {
						file.date = new Date(filename.substring(0, 10));
					}
					file.name = filename;
					if(downloadLink) {
						file.link = downloadLink;
					}
					files.push(file);

				});

				var counter = 0,
					numFiles = files.length;

				if(files.length > 0) {
					$(files).each(function(k, file) {
						counter++;
						CMS.getContent(type, file, counter, numFiles);
					});
				} else {
					var errorMsg = 'Error loading ' + type + 's in directory. Make sure ' +
						'there are Markdown ' + type + 's in the ' + type + 's folder.';
					CMS.renderError(errorMsg);
				}
			},
			error: function() {
				var errorMsg;
				if(CMS.settings.mode == 'Github') {
					errorMsg = 'Error loading ' + type + 's directory. Make sure ' +
						'your Github settings are correctly set in your config.js file.';
				} else {
					errorMsg = 'Error loading ' + type + 's directory. Make sure ' +
						type + 's directory is set correctly in config and .htaccess is in ' +
						type + 's directory with Apache "Options Indexes" set on.';
				}
				CMS.renderError(errorMsg);
			}
		});
	},
	getMenuItem: function(navItem) {
		nav = "";

		if(navItem.hasOwnProperty('href')) {
			nav += '<li><a href="' +  navItem.href + '"';
			if(navItem.hasOwnProperty('newWindow')) {
				if(navItem.newWindow) {
					nav += 'target="_blank"';
				}
			}
			nav += '>' + navItem.name + '</a></li>';
		} else {
			CMS.pages.forEach(function(page) {
				if(navItem.name == page.hash) {
					nav += '<li><a href="#" class="cms_nav_link" id="' + navItem.name + '">' + page.title + '</a></li>';
				}
			});
		}

		return nav;
	},
	setNavigation: function() {
		if(CMS.settings.remoteNavigation) {
			$.ajax({
				type: 'GET',
				url: CMS.settings.remoteNavigation  + "?key=" + CMS.requestKey,
				dataType: 'json',
				success: function(items) {
					CMS.setNavBar(items);
				},
				error: function() {
					var errorMsg = 'Error loading ' + CMS.settings.remoteNavigation + ' navigation menu';
					CMS.renderError(errorMsg);
				}
			});
		} else {
			CMS.setNavBar(CMS.settings.siteNavItems);
		}
	},

	setNavBar: function(siteNavItems) {

		var dropID = 1;
		var nav = '<ul class="nav navbar-nav navbar-right">';
		CMS.settings.siteNavItems.forEach(function(navItem) {
			if(navItem.hasOwnProperty('dropdown')) {
				nav +=  '<li>' + //<div class="dropdown">
  					    '<a id="dLabel' + dropID + '" data-target="#" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' +
    					navItem.name +
    					'<span class="caret"></span>' +
  						'</a>' +
						'<ul class="dropdown-menu" aria-labelledby="dLabel' + dropID + '">';
				navItem.dropdown.forEach(function(navSubItem) {
					nav += CMS.getMenuItem(navSubItem);
				});
				nav += '</ul></li>'; //</div>
				dropID++;
			} else {
				nav += CMS.getMenuItem(navItem);
			}
		});
		nav += '</ul>';

		$('.cms_nav').html(nav); //.hide().fadeIn(CMS.settings.fadeSpeed);

		// Set onclicks for nav links
		$.each($('.cms_nav_link'), function(k, link) {
			var title =  $(this).attr("id");
			$(this).on('click', function (e) {
				e.preventDefault();
				window.location.hash = 'page/' + title;
			});

		});
	},

	setSiteAttributes: function() {
		CMS.settings.siteAttributes.forEach(function(attribute) {

			var value;

			// Set brand
			if(attribute.attr == '.cms_sitename') {
				if (attribute.value.match(/\.(jpeg|jpg|gif|png)$/)) {
					value = '<img src="' + attribute.value + '" />';
				} else {
					value = attribute.value;
				}
				if (CMS.settings.defaultPage != '') {
					$(attribute.attr).attr("href", '#page/' + CMS.settings.defaultPage);
				}
				value += '<small class="cms_tagline"></small>';
			} else {
				value = attribute.value;
			}
			$(attribute.attr).html(value).hide().fadeIn(CMS.settings.fadeSpeed);
		});
	},

	generateSite: function() {

		this.setSiteAttributes();

		var types = ['image', 'post', 'page'];

		types.forEach(function(type){
			CMS.getFiles(type);
		});

		// Check for hash changes
        $(window).on('hashchange', function () {
            CMS.render(window.location.hash);
        });
	},

	init: function (options) {
		if ($.isPlainObject(options)) {
			return this.extend(this.settings, options, function () {
				CMS.generateSite();
			});
		}
	}

};
