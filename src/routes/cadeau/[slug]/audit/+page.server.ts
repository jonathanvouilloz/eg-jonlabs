import { error } from '@sveltejs/kit';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { marked } from 'marked';

export const prerender = false;

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
	const mdPath = join(process.cwd(), 'static', 'clients', params.slug, 'audit', 'audit.md');
	let raw: string;
	try {
		raw = await readFile(mdPath, 'utf-8');
	} catch {
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
