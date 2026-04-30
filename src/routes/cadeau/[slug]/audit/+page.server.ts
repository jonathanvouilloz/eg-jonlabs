import { error } from '@sveltejs/kit';
import { marked } from 'marked';

export const prerender = false;

// Vite bundles the markdown files into the server function. Works on Vercel
// (readFileSync of /static/ doesn't, since static/ is served by the CDN, not
// available in the serverless function filesystem).
const auditMarkdowns = import.meta.glob('/static/clients/*/audit/audit.md', {
	eager: true,
	query: '?raw',
	import: 'default'
}) as Record<string, string>;

function decodeEntities(s: string): string {
	return s
		.replace(/&#39;/g, "'")
		.replace(/&quot;/g, '"')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>');
}

function slugify(text: string): string {
	return decodeEntities(text)
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^\w\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-');
}

export const load = async ({ params }: { params: { slug: string } }) => {
	const key = `/static/clients/${params.slug}/audit/audit.md`;
	const raw = auditMarkdowns[key];
	if (!raw) {
		throw error(404, 'Rapport non disponible');
	}

	const rewritten = raw.replace(
		/!\[([^\]]*)\]\(screenshots\/([^)]+)\)/g,
		`![$1](/clients/${params.slug}/audit/screenshots/$2)`
	);

	const rendered = await marked.parse(rewritten, { gfm: true });

	const toc: { id: string; text: string }[] = [];
	const withIds = rendered.replace(/<h2>([^<]+)<\/h2>/g, (_, text: string) => {
		const id = slugify(text);
		toc.push({ id, text: decodeEntities(text) });
		return `<h2 id="${id}">${text}</h2>`;
	});

	// Split intro (h1 + blockquote) from body (sections h2+) on the first <hr>
	const hrIndex = withIds.indexOf('<hr>');
	const intro = hrIndex >= 0 ? withIds.slice(0, hrIndex) : '';
	const body = hrIndex >= 0 ? withIds.slice(hrIndex + '<hr>'.length) : withIds;

	return { intro, body, toc, slug: params.slug };
};
