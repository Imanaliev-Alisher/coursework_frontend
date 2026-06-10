/**
 * Extracts a human-readable message from an Axios/API error.
 *
 * DRF can return errors in several shapes:
 *   { detail: "..." }
 *   { non_field_errors: ["..."] }
 *   { field_name: ["..."], other_field: ["..."] }
 *   plain string
 */
export function getApiErrorMessage(error: unknown, fallback = 'Произошла ошибка'): string {
  if (!error) return fallback;

  const data = (error as any)?.response?.data;

  if (!data) {
    return (error as any)?.message || fallback;
  }

  if (typeof data === 'string') return data;

  if (typeof data.detail === 'string') return data.detail;

  if (Array.isArray(data.non_field_errors) && data.non_field_errors.length) {
    return data.non_field_errors.join(' ');
  }

  // Field-level errors: { title: ["Already exists."], ... }
  const fieldMessages: string[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (key === 'non_field_errors') continue;
    const msgs = Array.isArray(value) ? value.join(', ') : String(value);
    fieldMessages.push(`${key}: ${msgs}`);
  }
  if (fieldMessages.length) return fieldMessages.join('\n');

  return fallback;
}
