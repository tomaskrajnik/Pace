export const prettyClasses = (input: string) =>
    input
        .replace(/\s+/gm, ' ')
        .split(' ')
        .filter((cond: any) => typeof cond === 'string')
        .join(' ')
        .trim();

export const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ');
};
