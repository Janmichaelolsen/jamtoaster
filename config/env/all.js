'use strict';

module.exports = {
	app: {
		title: 'Jamtoaster',
		description: 'Love more music!',
		keywords: 'MongoDB, Express, AngularJS, Node.js'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/modules/core/css/superhero.min.css',
				'public/modules/core/css/custom.css',
				'public/lib/ngtoast/dist/ngToast.min.css'
			],
			js: [
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js',
				'public/lib/angular-cookies/angular-cookies.js',
				'public/lib/angular-animate/angular-animate.js',
				'public/lib/angular-touch/angular-touch.js',
				'public/lib/angular-sanitize/angular-sanitize.js',
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'https://connect.soundcloud.com/sdk.js',
				'https://w.soundcloud.com/player/api.js',
				'https://www.youtube.com/iframe_api',
				'public/lib/ngtoast/dist/ngToast.min.js'
			]
		},
		css: [
			'public/modules/**/css/*.css',
			'public/lib/ngtoast/dist/ngToast.min.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js',
			'https://connect.soundcloud.com/sdk.js',
			'https://w.soundcloud.com/player/api.js',
			'https://www.youtube.com/iframe_api',
			'public/lib/ngtoast/dist/ngToast.min.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
