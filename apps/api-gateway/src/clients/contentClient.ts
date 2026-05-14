export type FetchImpl = typeof fetch;

export type ContentClientOptions = {
  contentServiceUrl: string;
  fetchImpl: FetchImpl;
};

export async function forwardToContentService(
  options: ContentClientOptions,
  internalPath: string,
  headers: Record<string, string>
): Promise<Response> {
  return options.fetchImpl(`${options.contentServiceUrl}${internalPath}`, {
    headers
  });
}
