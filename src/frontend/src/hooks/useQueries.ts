import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export interface TournamentDetails {
  date: string;
  time: string;
  venue: string;
  numTeams: string;
  entryFee: string;
  prize: string;
  whatsappLink: string;
}

export interface Registration {
  id: bigint;
  teamName: string;
  captainName: string;
  captainPhone: string;
  captainEmail: string;
  numPlayers: bigint;
  submittedAt: bigint;
}

export function useTournamentDetails() {
  const { actor, isFetching } = useActor();
  return useQuery<TournamentDetails>({
    queryKey: ["tournamentDetails"],
    queryFn: async () => {
      if (!actor)
        return {
          date: "Coming Soon",
          time: "TBD",
          venue: "TBD",
          numTeams: "TBD",
          entryFee: "TBD",
          prize: "TBD",
          whatsappLink: "",
        };
      return (actor as any).getTournamentDetails();
    },
    enabled: !isFetching,
  });
}

export function useSubmitRegistration() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (data: {
      teamName: string;
      captainName: string;
      captainPhone: string;
      captainEmail: string;
      numPlayers: bigint;
    }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).submitRegistration(
        data.teamName,
        data.captainName,
        data.captainPhone,
        data.captainEmail,
        data.numPlayers,
      );
    },
  });
}

export function useVerifyPassword() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (password: string) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).verifyPassword(password) as Promise<boolean>;
    },
  });
}

export function useGetRegistrations(password: string, enabled: boolean) {
  const { actor, isFetching } = useActor();
  return useQuery<Registration[]>({
    queryKey: ["registrations", password],
    queryFn: async () => {
      if (!actor) return [];
      const result = await (actor as any).getRegistrations(password);
      return result ?? [];
    },
    enabled: enabled && !isFetching && !!password,
  });
}

export function useUpdateTournamentDetails() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      password: string;
      date: string;
      time: string;
      venue: string;
      numTeams: string;
      entryFee: string;
      prize: string;
      whatsappLink: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return (actor as any).updateTournamentDetails(
        data.password,
        data.date,
        data.time,
        data.venue,
        data.numTeams,
        data.entryFee,
        data.prize,
        data.whatsappLink,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tournamentDetails"] });
    },
  });
}
