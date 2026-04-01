import Time "mo:base/Time";
import Array "mo:base/Array";
import Iter "mo:base/Iter";

actor {
  // Tournament details
  stable var tournamentDetails = {
    date = "Coming Soon";
    time = "TBD";
    venue = "TBD";
    numTeams = "TBD";
    entryFee = "TBD";
    prize = "TBD";
    whatsappLink = "";
  };

  // Registrations
  type Registration = {
    id : Nat;
    teamName : Text;
    captainName : Text;
    captainPhone : Text;
    captainEmail : Text;
    numPlayers : Nat;
    submittedAt : Int;
  };

  stable var registrations : [Registration] = [];
  stable var nextId : Nat = 1;

  let ADMIN_PASSWORD = "DCL@admin2024";

  // Public: get tournament details
  public query func getTournamentDetails() : async {
    date : Text;
    time : Text;
    venue : Text;
    numTeams : Text;
    entryFee : Text;
    prize : Text;
    whatsappLink : Text;
  } {
    tournamentDetails
  };

  // Public: submit registration
  public func submitRegistration(
    teamName : Text,
    captainName : Text,
    captainPhone : Text,
    captainEmail : Text,
    numPlayers : Nat
  ) : async { success : Bool; message : Text } {
    let reg : Registration = {
      id = nextId;
      teamName;
      captainName;
      captainPhone;
      captainEmail;
      numPlayers;
      submittedAt = Time.now();
    };
    registrations := Array.append(registrations, [reg]);
    nextId += 1;
    { success = true; message = "Registration submitted successfully!" }
  };

  // Admin: verify password
  public query func verifyPassword(password : Text) : async Bool {
    password == ADMIN_PASSWORD
  };

  // Admin: get all registrations
  public query func getRegistrations(password : Text) : async ?[Registration] {
    if (password != ADMIN_PASSWORD) return null;
    ?registrations
  };

  // Admin: update tournament details
  public func updateTournamentDetails(
    password : Text,
    date : Text,
    time : Text,
    venue : Text,
    numTeams : Text,
    entryFee : Text,
    prize : Text,
    whatsappLink : Text
  ) : async { success : Bool; message : Text } {
    if (password != ADMIN_PASSWORD) {
      return { success = false; message = "Invalid password" };
    };
    tournamentDetails := { date; time; venue; numTeams; entryFee; prize; whatsappLink };
    { success = true; message = "Details updated successfully" }
  };
}
