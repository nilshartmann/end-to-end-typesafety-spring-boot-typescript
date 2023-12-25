import { EndpointByMethod, EndpointParameters } from "./api-types.ts";
import { z, ZodNever } from "zod";

function replacePlaceholders(
  text: string,
  values: { [key: string]: unknown },
): string {
  return text.replace(/{(\w+)}/g, (_, key) => {
    return String(values[key]) || "";
  });
}

function resolveUrl(path: string, params: EndpointParameters | undefined) {
  const url = `http://localhost:8080${path}`;

  if (!params) {
    return url;
  }

  const resolvedUrl =
    params.path !== undefined ? replacePlaceholders(url, params.path) : url;

  if (!("query" in params) && params.query !== undefined) {
    return resolvedUrl;
  }

  const searchParams = new URLSearchParams(
    params.query as Record<string, string>,
  );
  return `${resolvedUrl}?${searchParams.toString()}`;
}

// async function getFetch<T extends keyof GetEndpoints>(
//   path: T,
//   params: GetEndpoints[T]["parameters"] extends ZodNever
//     ? undefined
//     : z.infer<GetEndpoints[T]["parameters"]>,
// ): Promise<z.infer<GetEndpoints[T]["response"]>> {
//   const parameters = EndpointByMethod.get[path].parameters.parse(params);
//   const url = resolveUrl(path, parameters);

//   const schema = EndpointByMethod.get[path].response;

//   const r = fetch(url)
//     .then((response) => response.json())
//     .then((unknownResponse) => {
//       const parsedResponse = schema.parse(unknownResponse);
//       return parsedResponse;
//     });
//   return r;
// }

export type Flatten<P> = {
  [K in keyof P]: P[K];
} & {};

type ValuesOfType<T> = T extends { [K: string]: infer U } ? U : never;
type Endpoints = ValuesOfType<ValuesOfType<EndpointByMethod>>;

export async function fetchFromApi<EP extends Endpoints>(
  endpoint: EP,
  params: EP["parameters"] extends ZodNever
    ? undefined
    : z.infer<EP["parameters"]>,
): Promise<z.infer<EP["response"]>> {
  // make sure given params match expectations from backend

  const validatedParams = params ? endpoint.parameters.parse(params) : params;

  // replace variables and add url search params
  const url = resolveUrl(endpoint.path.value, validatedParams);

  const payload = validatedParams
    ? "body" in validatedParams
      ? JSON.stringify(validatedParams.body)
      : undefined
    : undefined;

  return fetch(url, {
    method: endpoint.method.value,
    headers: {
      "content-type": "application/json",
    },
    body: payload,
  })
    .then((response) => response.json())
    .then((unknownResponse) => {
      // make sure response returned from server is valid according
      // to schema
      const validatedResponse = endpoint.response.parse(unknownResponse);
      return validatedResponse;
    });
}

/**
 * Typesafe access of endpoints
 */
export function getEndpointConfig<
  M extends keyof EndpointByMethod,
  P extends keyof EndpointByMethod[M],
>(m: M, p: P): EndpointByMethod[M][P] {
  return EndpointByMethod[m][p];
}
