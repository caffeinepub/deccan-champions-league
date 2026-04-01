import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Facebook,
  Instagram,
  Loader2,
  MapPin,
  Menu,
  MessageCircle,
  Shield,
  Ticket,
  Trophy,
  Twitter,
  Users,
  X,
  Youtube,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  useGetRegistrations,
  useSubmitRegistration,
  useTournamentDetails,
  useUpdateTournamentDetails,
  useVerifyPassword,
} from "./hooks/useQueries";
import type { TournamentDetails } from "./hooks/useQueries";

const ADMIN_STORAGE_KEY = "dcl_admin_verified";

function formatTimestamp(ns: bigint): string {
  const ms = Number(ns / BigInt(1_000_000));
  return new Date(ms).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Floating football particle
function FootballParticle({
  style,
  delay,
}: { style: React.CSSProperties; delay: number }) {
  return (
    <div
      className="absolute text-2xl select-none pointer-events-none"
      style={{
        ...style,
        animation: `floatSlow ${6 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        opacity: 0.15,
      }}
    >
      ⚽
    </div>
  );
}

// Nav component
function Navbar(_props: { onAdminClick: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "nav-glass shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/assets/image-019d4887-9f60-72da-a9b9-109c072adc47.png"
              alt="DCL Logo"
              className="h-10 w-10 object-contain"
            />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {[
              ["HOME", "hero"],
              ["TOURNAMENT", "details"],
              ["REGISTER", "register"],
              ["CONTACT", "footer"],
            ].map(([label, id]) => (
              <button
                type="button"
                key={label}
                onClick={() => scrollTo(id)}
                className="font-display text-sm tracking-widest transition-colors hover:text-gold"
                style={{
                  color:
                    label === "REGISTER"
                      ? "oklch(0.87 0.17 90)"
                      : "oklch(0.75 0 0)",
                }}
                data-ocid={`nav.${label.toLowerCase()}.link`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Button
              onClick={() => scrollTo("register")}
              className="hidden md:flex font-display tracking-wider text-sm"
              style={{ background: "oklch(0.72 0.19 145)", color: "#0a0a0a" }}
              data-ocid="nav.register.button"
            >
              REGISTER NOW
            </Button>
            <button
              type="button"
              className="md:hidden text-foreground p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              data-ocid="nav.menu.toggle"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden nav-glass border-t border-border pb-4">
            {[
              ["HOME", "hero"],
              ["TOURNAMENT", "details"],
              ["REGISTER", "register"],
              ["CONTACT", "footer"],
            ].map(([label, id]) => (
              <button
                type="button"
                key={label}
                onClick={() => scrollTo(id)}
                className="block w-full text-left px-4 py-3 font-display tracking-widest text-sm hover:text-gold transition-colors"
                style={{ color: "oklch(0.75 0 0)" }}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

// Hero section
function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden hero-bg"
    >
      {/* Stadium bg overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-stadium.dim_1920x1080.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Green radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 60%, oklch(0.72 0.19 145 / 12%) 0%, transparent 70%)",
        }}
      />

      {/* Decorative corner swoosh top-left */}
      <div className="absolute top-0 left-0 w-64 h-64 pointer-events-none">
        <svg
          viewBox="0 0 200 200"
          fill="none"
          className="w-full h-full"
          aria-hidden="true"
        >
          <path
            d="M0 0 Q100 50 0 200"
            stroke="oklch(0.72 0.19 145)"
            strokeWidth="2"
            strokeOpacity="0.4"
            fill="none"
          />
          <path
            d="M0 0 Q150 80 0 200"
            stroke="oklch(0.87 0.17 90)"
            strokeWidth="1"
            strokeOpacity="0.25"
            fill="none"
          />
        </svg>
      </div>

      {/* Decorative corner swoosh bottom-right */}
      <div className="absolute bottom-0 right-0 w-64 h-64 pointer-events-none rotate-180">
        <svg
          viewBox="0 0 200 200"
          fill="none"
          className="w-full h-full"
          aria-hidden="true"
        >
          <path
            d="M0 0 Q100 50 0 200"
            stroke="oklch(0.87 0.17 90)"
            strokeWidth="2"
            strokeOpacity="0.4"
            fill="none"
          />
          <path
            d="M0 0 Q150 80 0 200"
            stroke="oklch(0.72 0.19 145)"
            strokeWidth="1"
            strokeOpacity="0.25"
            fill="none"
          />
        </svg>
      </div>

      {/* Floating footballs */}
      <FootballParticle style={{ top: "15%", left: "8%" }} delay={0} />
      <FootballParticle style={{ top: "25%", right: "10%" }} delay={2} />
      <FootballParticle style={{ top: "65%", left: "5%" }} delay={4} />
      <FootballParticle style={{ bottom: "20%", right: "8%" }} delay={1.5} />
      <FootballParticle style={{ top: "45%", left: "15%" }} delay={3} />
      <FootballParticle style={{ top: "70%", right: "20%" }} delay={5} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
        {/* Logo */}
        <img
          src="/assets/image-019d4887-9f60-72da-a9b9-109c072adc47.png"
          alt="Deccan Champions League"
          className="mb-8 w-40 h-40 object-contain drop-shadow-2xl"
        />

        {/* Headline */}
        <h1
          className="font-display font-bold uppercase tracking-widest mb-4"
          style={{ fontSize: "clamp(2rem, 6vw, 5rem)", lineHeight: 1.05 }}
        >
          <span className="shimmer-text">DECCAN CHAMPIONS</span>
          <br />
          <span className="text-gold">LEAGUE</span>
        </h1>

        <p
          className="font-display text-xl tracking-widest mb-2"
          style={{ color: "oklch(0.85 0 0)" }}
        >
          Where Football Legends Rise
        </p>
        <p
          className="font-body text-sm tracking-wide mb-10"
          style={{ color: "oklch(0.55 0 0)" }}
        >
          India's Premier Football Tournament
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() =>
              document
                .getElementById("register")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="font-display tracking-widest px-8 py-6 text-base"
            style={{ background: "oklch(0.72 0.19 145)", color: "#0a0a0a" }}
            data-ocid="hero.register.primary_button"
          >
            ⚽ REGISTER YOUR TEAM
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              document
                .getElementById("details")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="font-display tracking-widest px-8 py-6 text-base border-2"
            style={{
              borderColor: "oklch(0.87 0.17 90)",
              color: "oklch(0.87 0.17 90)",
              background: "transparent",
            }}
            data-ocid="hero.details.secondary_button"
          >
            VIEW DETAILS
          </Button>
        </div>

        {/* Scroll indicator */}
        <div
          className="mt-16 flex flex-col items-center"
          style={{ color: "oklch(0.45 0 0)" }}
        >
          <div
            className="w-px h-10 mb-2"
            style={{
              background:
                "linear-gradient(to bottom, oklch(0.72 0.19 145), transparent)",
            }}
          />
          <span className="text-xs font-body tracking-widest uppercase">
            Scroll Down
          </span>
        </div>
      </div>
    </section>
  );
}

// Tournament details section
function TournamentSection({
  details,
  isLoading,
}: { details: TournamentDetails | undefined; isLoading: boolean }) {
  const cards = [
    {
      icon: Calendar,
      label: "Date",
      value: details?.date ?? "Coming Soon",
      color: "oklch(0.72 0.19 145)",
    },
    {
      icon: Clock,
      label: "Time",
      value: details?.time ?? "TBD",
      color: "oklch(0.87 0.17 90)",
    },
    {
      icon: MapPin,
      label: "Venue",
      value: details?.venue ?? "TBD",
      color: "oklch(0.72 0.19 145)",
    },
    {
      icon: Users,
      label: "Teams",
      value: details?.numTeams ?? "TBD",
      color: "oklch(0.87 0.17 90)",
    },
    {
      icon: Ticket,
      label: "Entry Fee",
      value: details?.entryFee ?? "TBD",
      color: "oklch(0.72 0.19 145)",
    },
    {
      icon: Trophy,
      label: "Prize",
      value: details?.prize ?? "TBD",
      color: "oklch(0.87 0.17 90)",
    },
  ];

  return (
    <section
      id="details"
      className="py-24 px-4"
      style={{ background: "oklch(0.09 0.005 250)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p
            className="font-display tracking-widest text-sm mb-3"
            style={{ color: "oklch(0.72 0.19 145)" }}
          >
            THE TOURNAMENT
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-wide text-foreground">
            Tournament Details
          </h2>
          <div className="section-divider mt-6 max-w-sm mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div
              key={card.label}
              className="card-glow rounded-xl p-6 border"
              style={{
                background: "oklch(0.13 0.008 250)",
                borderColor: "oklch(0.22 0.01 250)",
              }}
              data-ocid={`details.item.${i + 1}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: `${card.color.replace(")", " / 15%)")}`,
                  }}
                >
                  <card.icon
                    className="w-5 h-5"
                    style={{ color: card.color }}
                  />
                </div>
                <span
                  className="font-body text-sm tracking-wider uppercase"
                  style={{ color: "oklch(0.55 0 0)" }}
                >
                  {card.label}
                </span>
              </div>
              {isLoading ? (
                <Skeleton
                  className="h-7 w-32"
                  style={{ background: "oklch(0.22 0.01 250)" }}
                />
              ) : (
                <p
                  className="font-display text-2xl font-semibold"
                  style={{ color: card.color }}
                >
                  {card.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Registration form
function RegistrationSection() {
  const [form, setForm] = useState({
    teamName: "",
    captainName: "",
    captainPhone: "",
    captainEmail: "",
    numPlayers: "",
  });
  const submit = useSubmitRegistration();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.teamName ||
      !form.captainName ||
      !form.captainPhone ||
      !form.captainEmail ||
      !form.numPlayers
    ) {
      toast.error("Please fill in all fields");
      return;
    }
    const num = Number.parseInt(form.numPlayers);
    if (Number.isNaN(num) || num < 5 || num > 25) {
      toast.error("Number of players must be between 5 and 25");
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.captainEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      const result = await submit.mutateAsync({
        teamName: form.teamName,
        captainName: form.captainName,
        captainPhone: form.captainPhone,
        captainEmail: form.captainEmail,
        numPlayers: BigInt(num),
      });
      if ((result as any)?.success) {
        toast.success(
          (result as any).message || "Registration submitted successfully!",
        );
        setForm({
          teamName: "",
          captainName: "",
          captainPhone: "",
          captainEmail: "",
          numPlayers: "",
        });
      } else {
        toast.error((result as any)?.message || "Submission failed");
      }
    } catch {
      toast.error("Failed to submit. Please try again.");
    }
  };

  return (
    <section
      id="register"
      className="py-24 px-4"
      style={{ background: "oklch(0.08 0 0)" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p
            className="font-display tracking-widest text-sm mb-3"
            style={{ color: "oklch(0.72 0.19 145)" }}
          >
            JOIN THE LEAGUE
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-wide text-foreground">
            Register Your Team
          </h2>
          <div className="section-divider mt-6 max-w-sm mx-auto" />
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border p-8 md:p-12"
          style={{
            background: "oklch(0.13 0.008 250)",
            borderColor: "oklch(0.72 0.19 145 / 35%)",
          }}
          data-ocid="registration.form"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <Label
                className="font-body text-sm tracking-wider uppercase"
                style={{ color: "oklch(0.65 0 0)" }}
              >
                Team Name *
              </Label>
              <Input
                value={form.teamName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, teamName: e.target.value }))
                }
                placeholder="e.g. Hyderabad Tigers FC"
                className="input-dark h-12 rounded-lg"
                data-ocid="registration.team_name.input"
              />
            </div>
            <div className="space-y-2">
              <Label
                className="font-body text-sm tracking-wider uppercase"
                style={{ color: "oklch(0.65 0 0)" }}
              >
                Captain Name *
              </Label>
              <Input
                value={form.captainName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, captainName: e.target.value }))
                }
                placeholder="e.g. Rahul Sharma"
                className="input-dark h-12 rounded-lg"
                data-ocid="registration.captain_name.input"
              />
            </div>
            <div className="space-y-2">
              <Label
                className="font-body text-sm tracking-wider uppercase"
                style={{ color: "oklch(0.65 0 0)" }}
              >
                Captain Phone *
              </Label>
              <Input
                value={form.captainPhone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, captainPhone: e.target.value }))
                }
                placeholder="e.g. +91 98765 43210"
                className="input-dark h-12 rounded-lg"
                data-ocid="registration.captain_phone.input"
              />
            </div>
            <div className="space-y-2">
              <Label
                className="font-body text-sm tracking-wider uppercase"
                style={{ color: "oklch(0.65 0 0)" }}
              >
                Captain Email *
              </Label>
              <Input
                type="email"
                value={form.captainEmail}
                onChange={(e) =>
                  setForm((p) => ({ ...p, captainEmail: e.target.value }))
                }
                placeholder="e.g. captain@team.com"
                className="input-dark h-12 rounded-lg"
                data-ocid="registration.captain_email.input"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label
                className="font-body text-sm tracking-wider uppercase"
                style={{ color: "oklch(0.65 0 0)" }}
              >
                Number of Players *
              </Label>
              <Input
                type="number"
                min="5"
                max="25"
                value={form.numPlayers}
                onChange={(e) =>
                  setForm((p) => ({ ...p, numPlayers: e.target.value }))
                }
                placeholder="e.g. 11 (min 5, max 25)"
                className="input-dark h-12 rounded-lg"
                data-ocid="registration.num_players.input"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={submit.isPending}
            className="w-full h-14 font-display text-base tracking-widest"
            style={{
              background: submit.isPending
                ? "oklch(0.5 0.1 145)"
                : "oklch(0.72 0.19 145)",
              color: "#0a0a0a",
            }}
            data-ocid="registration.submit_button"
          >
            {submit.isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> SUBMITTING...
              </>
            ) : (
              "⚽ SUBMIT REGISTRATION"
            )}
          </Button>
        </form>
      </div>
    </section>
  );
}

// WhatsApp section
function WhatsAppSection({ whatsappLink }: { whatsappLink: string }) {
  return (
    <section
      className="py-24 px-4"
      style={{ background: "oklch(0.09 0.005 250)" }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p
            className="font-display tracking-widest text-sm mb-3"
            style={{ color: "oklch(0.72 0.19 145)" }}
          >
            COMMUNITY
          </p>
          <h2 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-wide text-foreground">
            Join Our WhatsApp Group
          </h2>
          <div className="section-divider mt-6 max-w-sm mx-auto" />
        </div>

        <div
          className="rounded-2xl border p-8 md:p-12 flex flex-col md:flex-row items-center gap-10"
          style={{
            background: "oklch(0.13 0.008 250)",
            borderColor: "oklch(0.22 0.01 250)",
          }}
        >
          {/* QR Placeholder */}
          <div
            className="shrink-0 w-52 h-52 rounded-xl border-2 border-dashed flex flex-col items-center justify-center"
            style={{
              borderColor: "oklch(0.72 0.19 145 / 50%)",
              background: "oklch(0.72 0.19 145 / 8%)",
            }}
            data-ocid="whatsapp.qr.card"
          >
            <MessageCircle
              className="w-12 h-12 mb-2"
              style={{ color: "oklch(0.72 0.19 145 / 50%)" }}
            />
            <span
              className="text-xs text-center px-4 font-body"
              style={{ color: "oklch(0.55 0 0)" }}
            >
              Upload QR Code Here
            </span>
          </div>

          {/* Text */}
          <div className="flex-1 text-center md:text-left">
            <h3
              className="font-display text-3xl font-bold tracking-wide mb-3"
              style={{ color: "oklch(0.87 0.17 90)" }}
            >
              Stay Connected
            </h3>
            <p
              className="font-body text-base mb-2"
              style={{ color: "oklch(0.65 0 0)" }}
            >
              Join our official WhatsApp group to get real-time updates, match
              schedules, venue details, and connect with other teams
              participating in Deccan Champions League.
            </p>
            <p
              className="font-body text-sm mb-8"
              style={{ color: "oklch(0.5 0 0)" }}
            >
              Get instant notifications for fixtures, results, and important
              announcements.
            </p>
            {whatsappLink ? (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                data-ocid="whatsapp.join.button"
              >
                <Button
                  className="font-display tracking-widest px-10 py-5 text-base"
                  style={{ background: "#25D366", color: "#fff" }}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  JOIN WHATSAPP GROUP
                </Button>
              </a>
            ) : (
              <div>
                <Button
                  disabled
                  className="font-display tracking-widest px-10 py-5 text-base opacity-50"
                  style={{ background: "#25D366", color: "#fff" }}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  LINK COMING SOON
                </Button>
                <p
                  className="mt-3 text-xs font-body"
                  style={{ color: "oklch(0.45 0 0)" }}
                >
                  WhatsApp link will be added by the organizer soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Footer
function Footer({ onAdminClick }: { onAdminClick: () => void }) {
  const year = new Date().getFullYear();
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer id="footer" style={{ background: "oklch(0.07 0 0)" }}>
      <div className="section-divider" />
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.72 0.19 145), oklch(0.87 0.17 90))",
                }}
              >
                <Shield className="w-6 h-6" style={{ color: "#0a0a0a" }} />
              </div>
              <div>
                <p
                  className="font-display font-bold tracking-wider"
                  style={{ color: "oklch(0.87 0.17 90)" }}
                >
                  DECCAN CHAMPIONS
                </p>
                <p
                  className="font-display text-xs tracking-widest"
                  style={{ color: "oklch(0.72 0.19 145)" }}
                >
                  LEAGUE
                </p>
              </div>
            </div>
            <p
              className="font-body text-sm"
              style={{ color: "oklch(0.5 0 0)" }}
            >
              India's Premier Football Tournament. Bringing together the best
              teams from across the Deccan region.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="font-display tracking-widest text-sm uppercase mb-5"
              style={{ color: "oklch(0.72 0.19 145)" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                ["Home", "hero"],
                ["Tournament", "details"],
                ["Register", "register"],
              ].map(([label, id]) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => scrollTo(id)}
                    className="font-body text-sm hover:text-gold transition-colors"
                    style={{ color: "oklch(0.55 0 0)" }}
                    data-ocid={`footer.${label.toLowerCase()}.link`}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Social + Contact */}
          <div>
            <h4
              className="font-display tracking-widest text-sm uppercase mb-5"
              style={{ color: "oklch(0.72 0.19 145)" }}
            >
              Follow Us
            </h4>
            <div className="flex gap-3 mb-6">
              {[
                { Icon: Facebook, label: "Facebook" },
                { Icon: Instagram, label: "Instagram" },
                { Icon: Youtube, label: "YouTube" },
                { Icon: Twitter, label: "Twitter" },
              ].map(({ Icon, label }) => (
                <button
                  type="button"
                  key={label}
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: "oklch(0.16 0.008 250)",
                    color: "oklch(0.55 0 0)",
                  }}
                  title={label}
                  data-ocid={`footer.${label.toLowerCase()}.link`}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
            <p
              className="font-body text-xs"
              style={{ color: "oklch(0.45 0 0)" }}
            >
              📧 contact@deccanleague.com
              <br />📞 +91 XXXXX XXXXX
            </p>
          </div>
        </div>

        <div className="section-divider my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs" style={{ color: "oklch(0.4 0 0)" }}>
            © {year}.{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
              style={{ color: "oklch(0.45 0 0)" }}
            >
              Built with love using caffeine.ai
            </a>
          </p>
          <button
            type="button"
            onClick={onAdminClick}
            className="font-body text-xs hover:text-gold transition-colors"
            style={{ color: "oklch(0.4 0 0)" }}
            data-ocid="footer.admin.link"
          >
            🔒 Admin Panel
          </button>
        </div>
      </div>
    </footer>
  );
}

// Admin Panel
function AdminPanel({ onBack }: { onBack: () => void }) {
  const [password, setPassword] = useState("");
  const [isVerified, setIsVerified] = useState(() => {
    return localStorage.getItem(ADMIN_STORAGE_KEY) === "true";
  });
  const [storedPassword, setStoredPassword] = useState(() => {
    return localStorage.getItem("dcl_admin_password") ?? "";
  });
  const verifyMutation = useVerifyPassword();
  const updateMutation = useUpdateTournamentDetails();
  const registrations = useGetRegistrations(storedPassword, isVerified);
  const { data: details, isLoading: detailsLoading } = useTournamentDetails();

  const [adminForm, setAdminForm] = useState({
    date: "",
    time: "",
    venue: "",
    numTeams: "",
    entryFee: "",
    prize: "",
    whatsappLink: "",
  });

  useEffect(() => {
    if (details) {
      setAdminForm({
        date: details.date,
        time: details.time,
        venue: details.venue,
        numTeams: details.numTeams,
        entryFee: details.entryFee,
        prize: details.prize,
        whatsappLink: details.whatsappLink,
      });
    }
  }, [details]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ok = await verifyMutation.mutateAsync(password);
      if (ok) {
        setIsVerified(true);
        setStoredPassword(password);
        localStorage.setItem(ADMIN_STORAGE_KEY, "true");
        localStorage.setItem("dcl_admin_password", password);
        toast.success("Welcome, Admin!");
      } else {
        toast.error("Incorrect password");
      }
    } catch {
      toast.error("Login failed");
    }
  };

  const handleLogout = () => {
    setIsVerified(false);
    setStoredPassword("");
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem("dcl_admin_password");
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await updateMutation.mutateAsync({
        password: storedPassword,
        ...adminForm,
      });
      if ((result as any)?.success) {
        toast.success("Tournament details updated!");
      } else {
        toast.error((result as any)?.message || "Update failed");
      }
    } catch {
      toast.error("Failed to update details");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.08 0 0)" }}>
      {/* Header */}
      <div
        className="nav-glass border-b py-4 px-6 flex items-center justify-between"
        style={{ borderColor: "oklch(0.22 0.01 250)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.19 145), oklch(0.87 0.17 90))",
            }}
          >
            <Shield className="w-4 h-4" style={{ color: "#0a0a0a" }} />
          </div>
          <span className="font-display tracking-widest text-gold text-sm">
            DCL ADMIN PANEL
          </span>
        </div>
        <div className="flex items-center gap-3">
          {isVerified && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="font-body text-xs"
              style={{
                borderColor: "oklch(0.35 0 0)",
                color: "oklch(0.65 0 0)",
              }}
              data-ocid="admin.logout.button"
            >
              Logout
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="font-body text-xs"
            style={{ color: "oklch(0.55 0 0)" }}
            data-ocid="admin.back.button"
          >
            ← Back to Site
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {!isVerified ? (
          /* Login Gate */
          <div className="max-w-sm mx-auto">
            <div className="text-center mb-10">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "oklch(0.72 0.19 145 / 15%)",
                  border: "2px solid oklch(0.72 0.19 145 / 30%)",
                }}
              >
                <Shield
                  className="w-9 h-9"
                  style={{ color: "oklch(0.72 0.19 145)" }}
                />
              </div>
              <h2 className="font-display text-2xl font-bold tracking-wide text-foreground">
                Admin Login
              </h2>
              <p
                className="font-body text-sm mt-2"
                style={{ color: "oklch(0.5 0 0)" }}
              >
                Enter your password to access the admin panel
              </p>
            </div>
            <form
              onSubmit={handleLogin}
              className="rounded-xl border p-8 space-y-5"
              style={{
                background: "oklch(0.13 0.008 250)",
                borderColor: "oklch(0.22 0.01 250)",
              }}
              data-ocid="admin.login.panel"
            >
              <div className="space-y-2">
                <Label
                  className="font-body text-sm"
                  style={{ color: "oklch(0.65 0 0)" }}
                >
                  Password
                </Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="input-dark h-12 rounded-lg"
                  data-ocid="admin.password.input"
                />
              </div>
              <Button
                type="submit"
                disabled={verifyMutation.isPending}
                className="w-full h-12 font-display tracking-widest"
                style={{ background: "oklch(0.72 0.19 145)", color: "#0a0a0a" }}
                data-ocid="admin.login.submit_button"
              >
                {verifyMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "LOGIN"
                )}
              </Button>
            </form>
          </div>
        ) : (
          /* Admin Dashboard */
          <div>
            <div className="mb-8">
              <h2 className="font-display text-3xl font-bold tracking-wide text-foreground">
                Dashboard
              </h2>
              <p
                className="font-body text-sm mt-1"
                style={{ color: "oklch(0.5 0 0)" }}
              >
                Manage your tournament from here
              </p>
            </div>

            <Tabs defaultValue="details" className="space-y-6">
              <TabsList
                className="w-full md:w-auto"
                style={{
                  background: "oklch(0.13 0.008 250)",
                  border: "1px solid oklch(0.22 0.01 250)",
                }}
              >
                <TabsTrigger
                  value="details"
                  className="font-display tracking-widest text-xs data-[state=active]:text-background"
                  style={{ "--tw-ring-color": "oklch(0.72 0.19 145)" } as any}
                  data-ocid="admin.details.tab"
                >
                  TOURNAMENT DETAILS
                </TabsTrigger>
                <TabsTrigger
                  value="registrations"
                  className="font-display tracking-widest text-xs data-[state=active]:text-background"
                  data-ocid="admin.registrations.tab"
                >
                  REGISTRATIONS
                  {registrations.data && (
                    <span
                      className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        background: "oklch(0.72 0.19 145 / 25%)",
                        color: "oklch(0.72 0.19 145)",
                      }}
                    >
                      {registrations.data.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* Tournament Details Tab */}
              <TabsContent value="details">
                <form
                  onSubmit={handleSaveDetails}
                  className="rounded-xl border p-8"
                  style={{
                    background: "oklch(0.13 0.008 250)",
                    borderColor: "oklch(0.22 0.01 250)",
                  }}
                >
                  <h3
                    className="font-display text-lg tracking-wide mb-6"
                    style={{ color: "oklch(0.87 0.17 90)" }}
                  >
                    Update Tournament Details
                  </h3>
                  {detailsLoading ? (
                    <div
                      className="space-y-4"
                      data-ocid="admin.details.loading_state"
                    >
                      {["s1", "s2", "s3", "s4", "s5", "s6", "s7"].map((sk) => (
                        <Skeleton
                          key={sk}
                          className="h-12 w-full"
                          style={{ background: "oklch(0.18 0.01 250)" }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {[
                        ["date", "Date", "e.g. 15 April 2025"],
                        ["time", "Time", "e.g. 8:00 AM"],
                        ["venue", "Venue", "e.g. LB Stadium, Hyderabad"],
                        ["numTeams", "Number of Teams", "e.g. 16"],
                        ["entryFee", "Entry Fee", "e.g. ₹2,000 per team"],
                        ["prize", "Prize", "e.g. ₹50,000 + Trophy"],
                      ].map(([field, label, placeholder]) => (
                        <div key={field} className="space-y-2">
                          <Label
                            className="font-body text-sm tracking-wider uppercase"
                            style={{ color: "oklch(0.55 0 0)" }}
                          >
                            {label}
                          </Label>
                          <Input
                            value={adminForm[field as keyof typeof adminForm]}
                            onChange={(e) =>
                              setAdminForm((p) => ({
                                ...p,
                                [field]: e.target.value,
                              }))
                            }
                            placeholder={placeholder}
                            className="input-dark h-12 rounded-lg"
                            data-ocid={`admin.${field}.input`}
                          />
                        </div>
                      ))}
                      <div className="space-y-2 md:col-span-2">
                        <Label
                          className="font-body text-sm tracking-wider uppercase"
                          style={{ color: "oklch(0.55 0 0)" }}
                        >
                          WhatsApp Group Link
                        </Label>
                        <Input
                          value={adminForm.whatsappLink}
                          onChange={(e) =>
                            setAdminForm((p) => ({
                              ...p,
                              whatsappLink: e.target.value,
                            }))
                          }
                          placeholder="https://chat.whatsapp.com/..."
                          className="input-dark h-12 rounded-lg"
                          data-ocid="admin.whatsapp_link.input"
                        />
                      </div>
                    </div>
                  )}
                  <div className="mt-8">
                    <Button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="font-display tracking-widest px-8 h-12"
                      style={{
                        background: "oklch(0.72 0.19 145)",
                        color: "#0a0a0a",
                      }}
                      data-ocid="admin.save_details.submit_button"
                    >
                      {updateMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "SAVE DETAILS"
                      )}
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* Registrations Tab */}
              <TabsContent value="registrations">
                <div
                  className="rounded-xl border overflow-hidden"
                  style={{
                    background: "oklch(0.13 0.008 250)",
                    borderColor: "oklch(0.22 0.01 250)",
                  }}
                >
                  <div
                    className="px-6 py-4 border-b"
                    style={{ borderColor: "oklch(0.22 0.01 250)" }}
                  >
                    <h3
                      className="font-display text-lg tracking-wide"
                      style={{ color: "oklch(0.87 0.17 90)" }}
                    >
                      Registered Teams
                      {registrations.data && (
                        <span
                          className="ml-2 font-body text-sm"
                          style={{ color: "oklch(0.5 0 0)" }}
                        >
                          ({registrations.data.length} total)
                        </span>
                      )}
                    </h3>
                  </div>

                  {registrations.isLoading ? (
                    <div
                      className="p-6 space-y-3"
                      data-ocid="admin.registrations.loading_state"
                    >
                      {["s1", "s2", "s3", "s4"].map((sk) => (
                        <Skeleton
                          key={sk}
                          className="h-12 w-full"
                          style={{ background: "oklch(0.18 0.01 250)" }}
                        />
                      ))}
                    </div>
                  ) : registrations.data?.length === 0 ? (
                    <div
                      className="p-12 text-center"
                      data-ocid="registrations.empty_state"
                    >
                      <Users
                        className="w-12 h-12 mx-auto mb-3"
                        style={{ color: "oklch(0.35 0 0)" }}
                      />
                      <p
                        className="font-body text-sm"
                        style={{ color: "oklch(0.45 0 0)" }}
                      >
                        No registrations yet
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table data-ocid="admin.registrations.table">
                        <TableHeader>
                          <TableRow
                            style={{ borderColor: "oklch(0.22 0.01 250)" }}
                          >
                            {[
                              "ID",
                              "Team Name",
                              "Captain",
                              "Phone",
                              "Email",
                              "Players",
                              "Date",
                            ].map((h) => (
                              <TableHead
                                key={h}
                                className="font-display tracking-wider text-xs uppercase"
                                style={{ color: "oklch(0.55 0 0)" }}
                              >
                                {h}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {registrations.data?.map((reg, i) => (
                            <TableRow
                              key={String(reg.id)}
                              style={{ borderColor: "oklch(0.18 0.01 250)" }}
                              className="hover:bg-muted/30"
                              data-ocid={`registrations.item.${i + 1}`}
                            >
                              <TableCell
                                className="font-body text-xs"
                                style={{ color: "oklch(0.72 0.19 145)" }}
                              >
                                #{String(reg.id)}
                              </TableCell>
                              <TableCell className="font-body text-sm font-medium">
                                {reg.teamName}
                              </TableCell>
                              <TableCell className="font-body text-sm">
                                {reg.captainName}
                              </TableCell>
                              <TableCell
                                className="font-body text-sm"
                                style={{ color: "oklch(0.65 0 0)" }}
                              >
                                {reg.captainPhone}
                              </TableCell>
                              <TableCell
                                className="font-body text-sm"
                                style={{ color: "oklch(0.65 0 0)" }}
                              >
                                {reg.captainEmail}
                              </TableCell>
                              <TableCell className="font-body text-sm">
                                {String(reg.numPlayers)}
                              </TableCell>
                              <TableCell
                                className="font-body text-xs"
                                style={{ color: "oklch(0.5 0 0)" }}
                              >
                                {formatTimestamp(reg.submittedAt)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}

// Main App
export default function App() {
  const [view, setView] = useState<"main" | "admin">(() => {
    return window.location.hash === "#admin" ? "admin" : "main";
  });
  const { data: details, isLoading: detailsLoading } = useTournamentDetails();

  useEffect(() => {
    const onHashChange = () => {
      setView(window.location.hash === "#admin" ? "admin" : "main");
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const goToAdmin = () => {
    window.location.hash = "#admin";
    setView("admin");
  };

  const goToMain = () => {
    window.location.hash = "";
    setView("main");
  };

  return (
    <>
      <Toaster richColors theme="dark" />
      {view === "admin" ? (
        <AdminPanel onBack={goToMain} />
      ) : (
        <div className="relative">
          <Navbar onAdminClick={goToAdmin} />
          <main>
            <HeroSection />
            <TournamentSection details={details} isLoading={detailsLoading} />
            <RegistrationSection />
            <WhatsAppSection whatsappLink={details?.whatsappLink ?? ""} />
          </main>
          <Footer onAdminClick={goToAdmin} />
        </div>
      )}
    </>
  );
}
