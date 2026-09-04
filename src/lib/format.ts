export const cx = (...classes: Array<string | false | undefined>) =>
    classes.filter(Boolean).join(" ");

export const playgroundHref = (slug: string) =>
    `/playground?example=${encodeURIComponent(slug)}`;
