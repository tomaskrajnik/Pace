export const prettyClasses = (input: string) =>
    input
        .replace(/\s+/gm, ' ')
        .split(' ')
        .filter((cond: any) => typeof cond === 'string')
        .join(' ')
        .trim();
