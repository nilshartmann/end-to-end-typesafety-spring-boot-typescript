import { fetchFromApi, getEndpointConfig } from "./fetch-from-api.ts";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  ApiResponseGreeting,
  ApiResponseListGreetingSummary,
  UpdateGreetingPayload,
} from "./api-types.ts";

// fetchFromApi(getEndpointConfig("get", "/api/greetings"), undefined);
// fetchFromApi(getEndpointConfig("get", "/api/greetings/search"), {
//   query: { name: "fasdfasdf" },
// });
// fetchFromApi(getEndpointConfig("get", "/api/greetings/{greetingId}"), {
//   path: {
//     greetingId: 1,
//   },
// });
//
// fetchFromApi(getEndpointConfig("put", "/api/greetings/{greetingId}"), {
//   body: {
//     name: "klaus",
//     phrase: "...",
//   },
//   path: { greetingId: 1 },
// });

// async function putFetch<P extends keyof PutEndpoints>(
//   path: P,
//   params: PutEndpoints[P]["parameters"] extends ZodNever
//     ? undefined
//     : z.infer<PutEndpoints[P]["parameters"]>,
// ): Promise<z.infer<PutEndpoints[P]["response"]>> {
//   // fail if paramters are not correct at runtime
//   const validatedParams = EndpointByMethod.put[path].parameters.parse(params);
//   const url = resolveUrl(path, validatedParams);

//   const payload =
//     "body" in validatedParams
//       ? JSON.stringify(validatedParams.body)
//       : undefined;

//   return fetch(url, {
//     method: "PUT",
//     headers: {
//       "content-type": "application/json",
//     },
//     body: payload,
//   })
//     .then((response) => response.json())
//     .then((unknownResponse) => {
//       const responseSchema = EndpointByMethod.put[path].response;
//       return responseSchema.parse(unknownResponse);
//     });
// }

export function useSayHello() {
  return "Hello!";
}

export function useGetGreetingsQuery() {
  return useQuery<ApiResponseListGreetingSummary>({
    queryKey: ["greetings"],
    queryFn: () =>
      // Method + Path => Compile safe!
      // Return value => compile and runtime safe!
      fetchFromApi(getEndpointConfig("get", "/api/greetings"), undefined)
  });
}

export function useGetGreetingQuery(id: number) {
  return useQuery<ApiResponseGreeting>({
    queryKey: ["greetings", id],
    queryFn: () =>
      fetchFromApi(getEndpointConfig("get", "/api/greetings/{greetingId}"), {
        // Compile safe and runtime: variables in URL Path
        path: { greetingId: id },
      }),
  });
}

export function useFindGreetingsQuery(name: string) {
  return useQuery<ApiResponseListGreetingSummary>({
    queryKey: ["greetings", "with-name", name],
    queryFn: () =>
      fetchFromApi(getEndpointConfig("get", "/api/greetings/search"), {
        // Compile and runtime safe: URL Search Parameter
        query: { name },
      }),
  });
}

export function useUpdateGreetingMutation() {
  return useMutation({
    mutationKey: ["greetings"],
    mutationFn: (params: {
      greetingId: number;
      payload: UpdateGreetingPayload;
    }) =>
      fetchFromApi(getEndpointConfig("put", "/api/greetings/{greetingId}"), {
        // Compile safe: Request Payload
        body: params.payload,
        path: {
          greetingId: params.greetingId,
        },
      }),
  });
}
