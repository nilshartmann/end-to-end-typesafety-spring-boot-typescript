import {
  useGetGreetingQuery,
  useGetGreetingsQuery,
  useUpdateGreetingMutation,
} from "./use-queries.ts";
import { useState } from "react";

function Landing() {
  const [selectedGreetingId, setSelectedGreetingId] = useState<number | null>(
    null,
  );

  const {
    isLoading,
    isError,
    isSuccess,
    data: greetingsResponse,
    error,
  } = useGetGreetingsQuery();

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isError || !isSuccess) {
    console.log("ERROR", error);
    return <h1>Error!</h1>;
  }

  return (
    <>
      <div className={"container mx-auto w-64 space-y-4"}>
        {greetingsResponse?.data.map((g) => {
          return (
            <div
              key={g.id}
              className="flex space-x-4 rounded-2xl bg-gray-300 p-3"
            >
              <h1>{g.name}</h1>
              <button
                className={"bg-green-900 p-1 text-blue-100"}
                onClick={() =>
                  g.id == selectedGreetingId
                    ? setSelectedGreetingId(null)
                    : setSelectedGreetingId(g.id)
                }
              >
                Show
              </button>
            </div>
          );
        })}
      </div>
      {selectedGreetingId !== null && (
        <GreetingDetails greetingId={selectedGreetingId} />
      )}
    </>
  );
}

type GreetingDetailProps = {
  greetingId: number;
};

function GreetingDetails({ greetingId }: GreetingDetailProps) {
  const {
    isLoading,
    isError,
    isSuccess,
    error,
    data: greetingResponse,
  } = useGetGreetingQuery(greetingId);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isError || !isSuccess) {
    console.log("ERROR", error);
    return <h1>Error!</h1>;
  }

  return (
    <div className={"container mx-auto mt-4 w-64 space-y-4"}>
      <h1>
        {greetingResponse.data.phrase} {greetingResponse.data.name}
      </h1>
      <Editor greetingId={greetingId} />
    </div>
  );
}

type EditorProps = {
  greetingId: number;
};

function Editor({ greetingId }: EditorProps) {
  const [name, setName] = useState("");
  const [phrase, setPhrase] = useState("");
  const mutation = useUpdateGreetingMutation();

  const handleSave = async () => {
    mutation.mutateAsync({
      greetingId,
      payload: {
        name,
        phrase,
      },
    });
  };

  console.log("ERROR", mutation.error);

  return (
    <div className={"container mx-auto mt-4 w-64 space-y-4"}>
      <label>
        Name
        <input
          className={"border-2 border-amber-950"}
          type={"text"}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        Phrase
        <input
          className={"border-2 border-amber-950"}
          type={"text"}
          value={phrase}
          onChange={(e) => setPhrase(e.target.value)}
        />
      </label>

      <button
        className={"border-2 border-amber-950 bg-green-500 p-3"}
        onClick={() => handleSave()}
      >
        Save
      </button>
    </div>
  );
}

export default Landing;
