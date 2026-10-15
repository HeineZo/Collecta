const shareFormat = new Intl.NumberFormat("en-US", { style: "percent", maximumSignificantDigits: 2 });

// 0.1234 → "12%", 0.0021 → "0.21%"
export const formatShare = (ratio: number) => shareFormat.format(ratio);
