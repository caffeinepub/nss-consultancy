import { useMutation } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useSubmitEnquiry() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      company: string;
      phone: string;
      email: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.submitEnquiry(
        data.name,
        data.company,
        data.phone,
        data.email,
        data.message,
      );
    },
  });
}
