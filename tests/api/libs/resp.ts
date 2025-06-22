export async function parse<T>(resp: Response): Promise<T | null> {
  try {
    const result = await resp.json();
    return result as T;
  } catch (err) {
    console.error(`Error whilst parsing response json`, err);
    return null;
  }
}
