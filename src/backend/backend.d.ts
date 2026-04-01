import { ActorSubclass } from "@dfinity/agent";

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

export interface _SERVICE {
  getTournamentDetails: () => Promise<TournamentDetails>;
  submitRegistration: (
    teamName: string,
    captainName: string,
    captainPhone: string,
    captainEmail: string,
    numPlayers: bigint
  ) => Promise<{ success: boolean; message: string }>;
  verifyPassword: (password: string) => Promise<boolean>;
  getRegistrations: (password: string) => Promise<[] | [Registration[]]>;
  updateTournamentDetails: (
    password: string,
    date: string,
    time: string,
    venue: string,
    numTeams: string,
    entryFee: string,
    prize: string,
    whatsappLink: string
  ) => Promise<{ success: boolean; message: string }>;
}

declare const backend: ActorSubclass<_SERVICE>;
export default backend;
