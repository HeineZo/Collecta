const numberFormat = new Intl.NumberFormat("en-US");

// 33959 → "33,959"
export const formatNumber = (value: number) => numberFormat.format(value);
