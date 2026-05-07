import { redirect, type Handle } from '@sveltejs/kit';

const cadeauPattern = /^\/cadeau\/([^/]+)(\/audit)?\/?$/;

export const handle: Handle = async ({ event, resolve }) => {
	const match = event.url.pathname.match(cadeauPattern);
	if (match) {
		const slug = match[1];
		const isAudit = Boolean(match[2]);
		const target = isAudit ? `/landing/${slug}/audit` : `/site/${slug}`;
		throw redirect(301, target + event.url.search);
	}

	return resolve(event);
};
