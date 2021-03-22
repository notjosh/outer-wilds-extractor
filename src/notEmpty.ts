// via https://stackoverflow.com/questions/43118692/typescript-filter-out-nulls-from-an-array
export default function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  if (value === null || value === undefined) return false;
  const testDummy: TValue = value;
  return true;
}
