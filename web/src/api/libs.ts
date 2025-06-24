export async function parse<T>(resp: Response): Promise<T | null> {
  try {
    const result = await resp.json();
    return result as T;
  } catch (err) {
    console.error(`Error whilst parsing response json`, err);
    return null;
  }
}

/**
 * Joins multiple string segments into a single URL path.
 *
 * - Removes any leading/trailing slashes from each segment
 * - Ensures the result is clean and properly separated by single `/`
 *
 * @param args - Individual parts of a URL path
 * @returns A normalized URL path
 */
export function u(...args: string[]): string {
  return args
    .map((part) => part.replace(/^\/+|\/+$/g, "")) // Trim leading/trailing slashes
    .filter(Boolean) // Remove empty strings
    .join("/"); // Join with single slash
}

type ParametersTypes = string | number | boolean | undefined | null;

/**
 * Converts an object into a URL query string.
 *
 * Skips `null` and `undefined` values.
 * Returns an empty string if there are no valid params.
 *
 * @param object - Key-value pairs to convert
 * @returns A query string starting with `?`, or an empty string
 */
export function p(
  object: Record<string, ParametersTypes | ParametersTypes[]>
): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(object)) {
    if (value === null || value === undefined) continue;

    if (Array.isArray(value)) {
      if (value.length > 0) {
        searchParams.append(key, value.join(","));
      }
    } else {
      searchParams.append(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}
