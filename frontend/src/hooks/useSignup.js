import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api.js";

const useSignup = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,

    // queryClient.invalidateQueries – Marks matching cached queries as stale, triggering a refetch so the UI displays the latest server data.
    // invalidateQueries – Tells TanStack Query, “This data might be old, go get it fresh from the server.”

    // once user successfully signup then refetching authentication user
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });
  return { isPending, error, signupMutation: mutate };
};

export default useSignup;

// #[detail of onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }), this line]
/*
Meaning:

onSuccess → Runs after a mutation (or query) successfully completes.

queryClient.invalidateQueries(...) → Marks certain cached queries as “stale” so TanStack Query will refetch them the next time they’re needed.

{ queryKey: ["authUser"] } → Targets the specific query with the key "authUser".

In plain English:

“After this request succeeds, refresh (refetch) the authUser query so the UI shows the updated authentication/user data.”

Example scenario:
If you log in a user with a mutation, the authUser query (which might hold their profile info) should be updated immediately — so you invalidate it, and TanStack Query will go fetch the latest data from the server.
*/
