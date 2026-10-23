// The index `offset` steps away, wrapping around both ends: stepIndex(0, -1, 5) → 4
export const stepIndex = (index: number, offset: number, length: number) => (index + offset + length) % length;
