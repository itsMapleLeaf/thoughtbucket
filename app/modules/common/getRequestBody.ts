export async function getRequestBody(
  request: Request,
): Promise<Record<string, string>> {
  return Object.fromEntries(new URLSearchParams(await request.text()))
}
