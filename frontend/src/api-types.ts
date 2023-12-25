import z from "zod";

export type UpdateGreetingPayload = z.infer<typeof UpdateGreetingPayload>;
export const UpdateGreetingPayload = z.object({
  name: z.string(),
  phrase: z.string(),
});

export type Greeting = z.infer<typeof Greeting>;
export const Greeting = z.object({
  id: z.number(),
  phrase: z.string(),
  name: z.string(),
  greetingType: z.union([
    z.literal("FORMAL"),
    z.literal("PERSONAL"),
    z.literal("CASUAL"),
    z.literal("PROFESSIONAL"),
  ]),
});

export type ApiResponseGreeting = z.infer<typeof ApiResponseGreeting>;
export const ApiResponseGreeting = z.object({
  data: Greeting,
});

export type GreetingSummary = z.infer<typeof GreetingSummary>;
export const GreetingSummary = z.object({
  id: z.number(),
  name: z.string(),
});

export type ApiResponseListGreetingSummary = z.infer<
  typeof ApiResponseListGreetingSummary
>;
export const ApiResponseListGreetingSummary = z.object({
  data: z.array(GreetingSummary),
});

export type get_GreetingById = typeof get_GreetingById;
export const get_GreetingById = {
  method: z.literal("GET"),
  path: z.literal("/api/greetings/{greetingId}"),
  parameters: z.object({
    path: z.object({
      greetingId: z.number(),
    }),
  }),
  response: ApiResponseGreeting,
};

export type put_UpdateGreetingById = typeof put_UpdateGreetingById;
export const put_UpdateGreetingById = {
  method: z.literal("PUT"),
  path: z.literal("/api/greetings/{greetingId}"),
  parameters: z.object({
    path: z.object({
      greetingId: z.number(),
    }),
    body: UpdateGreetingPayload,
  }),
  response: ApiResponseGreeting,
};

export type get_Greetings = typeof get_Greetings;
export const get_Greetings = {
  method: z.literal("GET"),
  path: z.literal("/api/greetings"),
  parameters: z.never(),
  response: ApiResponseListGreetingSummary,
};

export type get_Greetings_1 = typeof get_Greetings_1;
export const get_Greetings_1 = {
  method: z.literal("GET"),
  path: z.literal("/api/greetings/search"),
  parameters: z.object({
    query: z.object({
      name: z.string(),
    }),
  }),
  response: ApiResponseListGreetingSummary,
};

// <EndpointByMethod>
export const EndpointByMethod = {
  get: {
    "/api/greetings/{greetingId}": get_GreetingById,
    "/api/greetings": get_Greetings,
    "/api/greetings/search": get_Greetings_1,
  },
  put: {
    "/api/greetings/{greetingId}": put_UpdateGreetingById,
  },
};
export type EndpointByMethod = typeof EndpointByMethod;
// </EndpointByMethod>

// <EndpointByMethod.Shorthands>
export type GetEndpoints = EndpointByMethod["get"];
export type PutEndpoints = EndpointByMethod["put"];
export type AllEndpoints = EndpointByMethod[keyof EndpointByMethod];
// </EndpointByMethod.Shorthands>

// <ApiClientTypes>
export type EndpointParameters = {
  body?: unknown;
  query?: Record<string, unknown>;
  header?: Record<string, unknown>;
  path?: Record<string, unknown>;
};

export type MutationMethod = "post" | "put" | "patch" | "delete";
export type Method = "get" | "head" | MutationMethod;

export type DefaultEndpoint = {
  parameters?: EndpointParameters | undefined;
  response: unknown;
};

export type Endpoint<TConfig extends DefaultEndpoint = DefaultEndpoint> = {
  operationId: string;
  method: Method;
  path: string;
  parameters?: TConfig["parameters"];
  meta: {
    alias: string;
    hasParameters: boolean;
    areParametersRequired: boolean;
  };
  response: TConfig["response"];
};

type Fetcher = (
  method: Method,
  url: string,
  parameters?: EndpointParameters | undefined,
) => Promise<Endpoint["response"]>;

type RequiredKeys<T> = {
  [P in keyof T]-?: undefined extends T[P] ? never : P;
}[keyof T];

type MaybeOptionalArg<T> = RequiredKeys<T> extends never
  ? [config?: T]
  : [config: T];

// </ApiClientTypes>

// <ApiClient>
export class ApiClient {
  baseUrl: string = "";

  constructor(public fetcher: Fetcher) {}

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
    return this;
  }

  // <ApiClient.get>
  get<Path extends keyof GetEndpoints, TEndpoint extends GetEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint["parameters"]>>
  ): Promise<z.infer<TEndpoint["response"]>> {
    return this.fetcher("get", this.baseUrl + path, params[0]) as Promise<
      z.infer<TEndpoint["response"]>
    >;
  }
  // </ApiClient.get>

  // <ApiClient.put>
  put<Path extends keyof PutEndpoints, TEndpoint extends PutEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint["parameters"]>>
  ): Promise<z.infer<TEndpoint["response"]>> {
    return this.fetcher("put", this.baseUrl + path, params[0]) as Promise<
      z.infer<TEndpoint["response"]>
    >;
  }
  // </ApiClient.put>
}

export function createApiClient(fetcher: Fetcher, baseUrl?: string) {
  return new ApiClient(fetcher).setBaseUrl(baseUrl ?? "");
}

/**
 Example usage:
 const api = createApiClient((method, url, params) =>
   fetch(url, { method, body: JSON.stringify(params) }).then((res) => res.json()),
 );
 api.get("/users").then((users) => console.log(users));
 api.post("/users", { body: { name: "John" } }).then((user) => console.log(user));
 api.put("/users/:id", { path: { id: 1 }, body: { name: "John" } }).then((user) => console.log(user));
*/

// </ApiClient
