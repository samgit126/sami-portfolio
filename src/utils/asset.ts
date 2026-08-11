/**
 * Resolve a path from /public against the deployment base.
 *
 * Vite rewrites asset URLs it can see at build time, but paths that live in
 * data as plain strings ("/projects/haleta.webp") reach the browser untouched.
 * On a root deployment that is fine; on GitHub Pages, where the site is served
 * from /<repo>/, every one of them would 404. Run them through here instead.
 */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}
