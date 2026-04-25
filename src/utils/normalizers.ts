export const normalizeWhitespace = (value: string) => value.trim().replace(/\s+/g, ' ');

export const normalizeEmail = (value: string) => normalizeWhitespace(value).toLowerCase();

export const normalizePhoneNumber = (value: string) => normalizeWhitespace(value).replace(/(?!^\+)[^\d]/g, '');

export const toTitleCase = (value: string) =>
  normalizeWhitespace(value)
    .split(' ')
    .map((part) =>
      part
        .split('-')
        .map((segment) => {
          if (!segment) {
            return segment;
          }

          return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
        })
        .join('-'),
    )
    .join(' ');

export const normalizeStringList = (values: string[]) => {
  const seen = new Set<string>();

  return values.reduce<string[]>((accumulator, value) => {
    const normalized = toTitleCase(value);
    const key = normalized.toLowerCase();

    if (seen.has(key)) {
      return accumulator;
    }

    seen.add(key);
    accumulator.push(normalized);
    return accumulator;
  }, []);
};
