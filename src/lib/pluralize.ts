// Regular English plurals only: (1, "work") → "work", (2, "work") → "works"
export const pluralize = (count: number, noun: string) => (count === 1 ? noun : `${noun}s`);
