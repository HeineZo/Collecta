// shortcut: relies on the Met's "/original/" → "/web-large/" URL convention
export const toWebLarge = (imageUrl: string) => imageUrl.replace("/original/", "/web-large/");
