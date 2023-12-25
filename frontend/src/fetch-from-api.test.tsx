import { expect, test } from "vitest";

import { renderHook, waitFor } from "@testing-library/react";
import {
  useFindGreetingsQuery,
  useGetGreetingQuery,
  useGetGreetingsQuery,
  useUpdateGreetingMutation,
} from "./use-queries.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { JSXElementConstructor, ReactElement } from "react";

test("api endpoint without params", async () => {
  const { result } = renderHook(() => useGetGreetingsQuery(), {
    wrapper: queryClientWrapper(),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  //
  expect(result.current.data?.data.length).toBe(3);
});

test("api endpoint with url variable", async () => {
  const { result } = renderHook(() => useGetGreetingQuery(1), {
    wrapper: queryClientWrapper(),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data?.data.id).toBe(1);
});

test("api endpoint with search params", async () => {
  const { result } = renderHook(() => useFindGreetingsQuery("Susi"), {
    wrapper: queryClientWrapper(),
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data?.data.length).toBe(1);
});

test("api endpoint with body", async () => {
  const { result } = renderHook(() => useUpdateGreetingMutation(), {
    wrapper: queryClientWrapper(),
  });

  result.current.mutate({
    greetingId: 1,
    payload: {
      name: "Sarah",
      phrase: "Good Morning!",
    },
  });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data?.data.name).toBe("Sarah");
});

function queryClientWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const wrapper: JSXElementConstructor<{
    children: ReactElement;
  }> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return wrapper;
}
