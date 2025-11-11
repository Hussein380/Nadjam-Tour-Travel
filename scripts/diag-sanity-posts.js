// Diagnose Sanity blog posts ordering/visibility
// Load env from .env.local (preferred) then .env for Node scripts
try {
	require('dotenv').config({ path: '.env.local' });
	require('dotenv').config(); // fallback .env
} catch {}
const { createClient } = require('@sanity/client');
const groq = require('groq');

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';
const apiVersion = process.env.SANITY_API_VERSION || '2024-01-01';
const token = process.env.SANITY_READ_TOKEN;

if (!projectId) {
	console.error('SANITY_PROJECT_ID is missing.');
	process.exit(1);
}

const client = createClient({
	projectId,
	dataset,
	apiVersion,
	useCdn: !token,
	token,
	perspective: 'published',
});

const qCount = groq`count(*[_type == "post"])`;
const qLatest = groq`
  *[_type == "post" && defined(slug.current) && publishedAt <= now()]
  | order(publishedAt desc)[0...10]{
    _id, title, "slug": slug.current, publishedAt
  }
`;
const qExcludedFuture = groq`
  *[_type == "post" && defined(slug.current) && publishedAt > now()]
  | order(publishedAt asc)[0...5]{ _id, title, "slug": slug.current, publishedAt }
`;
const qMissingSlug = groq`
  *[_type == "post" && !defined(slug.current)]
  | order(_createdAt desc)[0...5]{ _id, title, publishedAt }
`;

(async () => {
	try {
		const [total, latest, future, noSlug] = await Promise.all([
			client.fetch(qCount),
			client.fetch(qLatest),
			client.fetch(qExcludedFuture),
			client.fetch(qMissingSlug),
		]);

		console.log('Sanity Posts Summary:');
		console.log(' - Total posts:', total);
		console.log(' - Latest visible (<= now, has slug):');
		latest.forEach((p, i) => {
			console.log(`   ${i + 1}. ${p.title} | slug=${p.slug} | publishedAt=${p.publishedAt}`);
		});
		if (future.length) {
			console.log(' - Posts excluded (publishedAt > now):');
			future.forEach(p => {
				console.log(`   ${p.title} | slug=${p.slug} | publishedAt=${p.publishedAt}`);
			});
		}
		if (noSlug.length) {
			console.log(' - Posts missing slug (excluded by query):');
			noSlug.forEach(p => {
				console.log(`   ${p._id} | ${p.title} | publishedAt=${p.publishedAt}`);
			});
		}
		process.exit(0);
	} catch (err) {
		console.error('Failed to fetch from Sanity:', err?.message || err);
		process.exit(2);
	}
})();


