# "End-to-end" typesafety with Spring Boot and TypeScript

This repository contains a sample workflow that provides (more or less) end-to-end typesafety with REST API calls from a TypeScript frontend into a Spring Boot Java backend.

## Techstack:

* Spring Boot 3.2: the backend with a REST API
* [Spring Doc](https://springdoc.org/) generates OpenAPI spec for your REST API
* [typed-openapi](https://github.com/astahmer/typed-openapi): JavaScript library that converts the OpenAPI spec to Zod schema definitions
* [zod](https://zod.dev): Provides the typescript types and runtime validation for the API data
* [TanStack Query](https://tanstack.com/query/latest): used as an example how to use the generated TypeScript code.
* [Vitest](https://vitest.dev/): used for some simple integration/end-to-end tests

## How it works:

- You enable (install) Spring Doc that provides a Swagger UI for your API and a OpenAPI spec with a description of your own API.
- You write your REST Controllers as usual in Spring Boot
  - You might want to add SpringDoc/Swagger annotations to your controller to descripe your API more precisly, if SpringDoc's default is not enought (see for example `nh.greetings.domain.api.GreetingController.greetingById`)
  - There is a bean `nh.greetings.domain.api.OpenApiDocGenerator` that generates and exports the OpenAPI description to the file `frontend/generated-api-doc.yaml` on each server restart, so that you can be sure that the exported description file is always up-to-date
- In the frontend there is a (p)npm script `openapi:watch`
  - When it runs, this script picks up changes in `generated-api-doc.yaml` and re-generates the TS/zod types to `src/api-types.ts` using `typed-openapi` with `runtime` set to `zod`.
  - `api-types.ts` contains the TypeScript/zod definition of your api, which is always up-to-date during development and matches your API description
  - See example usage in `src/fetch-from-api.ts` and `src/use-queries.ts` which makes use of TanStack Query `useQuery` and `useMutation` hooks

## Examples

```typescript jsx
export function useGetGreetingsQuery() {
  return useQuery<ApiResponseListGreetingSummary>({
    queryKey: ["greetings"],
    queryFn:  () =>
                      // Method + Path => Compile safe!
                      // Return value => compile and runtime safe!
                      fetchFromApi(getEndpointConfig("get", "/api/greetings"), undefined)
  });
}

export function useGetGreetingQuery(id: number) {
  return useQuery<ApiResponseGreeting>({
    queryKey: ["greetings", id],
    queryFn:  () =>
                      fetchFromApi(getEndpointConfig("get", "/api/greetings/{greetingId}"), {
                        // Compile and runtime safe: variables in URL Path
                        path: {greetingId: id},
                      }),
  });
}

export function useFindGreetingsQuery(name: string) {
  return useQuery<ApiResponseListGreetingSummary>({
    queryKey: ["greetings", "with-name", name],
    queryFn:  () =>
                      fetchFromApi(getEndpointConfig("get", "/api/greetings/search"), {
                        // Compile and runtime safe: URL Search Parameter
                        query: {name},
                      }),
  });
}
```

## Limitations

- The `typed-openapi` does not support constraints like min- or max-length, even when they are specified in your OpenAPI spec (for example with Jakarta `@Size` annotation in Spring)
- No support of multiple response types in `typed-openapi`

### Is this really a "REST" API?

- I don't care

## Questions, comments, feedback

If you have questions or commments, please feel free to open an issue here in this directory.

You can also reach and follow me on [several platforms](https://nilshartmann.net/follow-me).