export function isEmpty(n: string) {
  return !n || n.length === 0;
}

export function isLongEnough(n: string) {
  return n.length >= 4;
}

export async function isTaken(name: string) {
  const url = new URL('some-url');
  url.searchParams.append('username', name);
  const response = await fetch(url as any);
  if (response.status === 200) {
    const json = await response.json();
    if (json.taken === true || json.taken === false) {
      return json.taken as boolean;
    } else {
      throw new Error('Malformed json');
    }
  } else {
    throw new Error('Server error');
  }
}
