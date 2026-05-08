import { writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { isValidSlug } from './crm';

const CLIENTS_DIR = resolve(process.cwd(), 'static', 'clients');
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

const MIME_TO_EXT: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/jpg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
	'image/gif': 'gif'
};

export type ImageKind = 'hero' | 'logo';

export type UploadResult =
	| { ok: true; publicPath: string; bytesWritten: number }
	| {
			ok: false;
			reason: 'invalid_slug' | 'no_file' | 'too_large' | 'unsupported_type' | 'write_failed';
			detail?: string;
	  };

/**
 * Writes an uploaded image to static/clients/[slug]/[kind].[ext] and returns its public path.
 * Removes any prior {kind}.* files (different extensions) so we never end up with stale assets.
 */
export async function uploadImage(
	slug: string,
	kind: ImageKind,
	file: File | null
): Promise<UploadResult> {
	if (!isValidSlug(slug)) return { ok: false, reason: 'invalid_slug' };
	if (!file || file.size === 0) return { ok: false, reason: 'no_file' };
	if (file.size > MAX_BYTES) {
		return {
			ok: false,
			reason: 'too_large',
			detail: `${(file.size / 1024 / 1024).toFixed(2)} MB > 5 MB`
		};
	}

	const ext = MIME_TO_EXT[file.type];
	if (!ext) return { ok: false, reason: 'unsupported_type', detail: file.type };

	const dir = join(CLIENTS_DIR, slug);
	mkdirSync(dir, { recursive: true });

	// Remove prior {kind}.* files (different ext) to keep one canonical asset per kind.
	if (existsSync(dir)) {
		for (const entry of readdirSync(dir)) {
			if (
				entry === `${kind}.jpg` ||
				entry === `${kind}.png` ||
				entry === `${kind}.webp` ||
				entry === `${kind}.gif`
			) {
				if (entry !== `${kind}.${ext}`) {
					try {
						unlinkSync(join(dir, entry));
					} catch {
						/* ignore */
					}
				}
			}
		}
	}

	const filename = `${kind}.${ext}`;
	const targetPath = join(dir, filename);
	const publicPath = `/clients/${slug}/${filename}`;

	try {
		const buffer = Buffer.from(await file.arrayBuffer());
		writeFileSync(targetPath, buffer);
		return { ok: true, publicPath, bytesWritten: buffer.length };
	} catch (err) {
		return { ok: false, reason: 'write_failed', detail: String(err) };
	}
}
