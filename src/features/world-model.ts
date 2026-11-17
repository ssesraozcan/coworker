export type Plan = {
  id: string;
  title: string;
  note: string;
  date: string;
  time: string;
  minutes: number;
};
export type WorldState = {
  members: number;
  premium: null | "monthly" | "annual";
  code: string;
  plans: Plan[];
};
export const emptyWorld: WorldState = {
  members: 1,
  premium: null,
  code: "KIYI27",
  plans: [],
};
export const capacity = (s: WorldState) => (s.premium ? 12 : 8);
export function joinWorld(
  s: WorldState,
  code: string,
): { state: WorldState; error?: "invalid" | "full" } {
  if (code.trim().toUpperCase() !== s.code)
    return { state: s, error: "invalid" };
  if (s.members >= capacity(s)) return { state: s, error: "full" };
  return { state: { ...s, members: s.members + 1 } };
}
export function decodeWorld(raw: string | null): WorldState {
  try {
    const s = JSON.parse(raw || "null");
    if (
      !s ||
      !Number.isInteger(s.members) ||
      s.members < 1 ||
      s.members > (s.premium ? 12 : 8) ||
      ![null, "monthly", "annual"].includes(s.premium) ||
      typeof s.code !== "string" ||
      !Array.isArray(s.plans)
    )
      return emptyWorld;
    return {
      ...s,
      plans: s.plans.filter(
        (p: Plan) =>
          typeof p.id === "string" &&
          typeof p.title === "string" &&
          typeof p.date === "string" &&
          typeof p.time === "string" &&
          Number.isFinite(p.minutes) &&
          p.minutes > 0,
      ),
    };
  } catch {
    return emptyWorld;
  }
}
