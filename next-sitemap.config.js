/** @type {import('next-sitemap').IConfig} */
module.exports = {
	siteUrl: 'https://nadjamtravel.com',
	generateRobotsTxt: true,
	sitemapSize: 7000,
	exclude: [
		'/admin',
		'/admin/**',
		'/api',
		'/api/**',
		'/nadjam/*',
		'/nadjam/**',
		'/_*',
		'/_*/**',
	],
};


