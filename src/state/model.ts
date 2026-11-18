export type ItemId = "plant" | "bench" | "lantern";
export type Placement = {
  id: string;
  item: ItemId;
  area: "home" | "island";
  x: number;
  y: number;
};
export type Session = {
  id: string;
  duration: number;
  remaining: number;
  deadline: number | null;
  goal: string;
  shared: boolean;
};
export type StudyRecord = {
  id: string;
  completedAt: number;
  minutes: number;
  shared: boolean;
};
export type Routine = { minutes: number; days: number[] };
export type ObjectPlacement = {
  objectId: number;
  area: "home" | "island";
  x: number;
  y: number;
};
export type State = {
  routine: Routine;
  ownedObjects: number[];
  objectPlacements: ObjectPlacement[];
  notifications: boolean;
  leaves: number;
  outfit: string;
  placements: Placement[];
  records: StudyRecord[];
  claims: string[];
  session: Session | null;
};
export const initialState: State = {
  routine: { minutes: 75, days: [0, 1, 2, 3, 4, 5, 6] },
  ownedObjects: [1, 12, 6, 7, 4, 36, 9, 10, 11, 27, 30, 24],
  objectPlacements: [],
  notifications: true,
  leaves: 240,
  outfit: "hoodie",
  placements: [],
  records: [],
  claims: [],
  session: null,
};
export const prices: Record<ItemId, number> = {
  plant: 80,
  bench: 120,
  lantern: 100,
};
export function remaining(session: Session, now = Date.now()) {
  return session.deadline === null
    ? session.remaining
    : Math.max(0, Math.ceil((session.deadline - now) / 1000));
}
export function finish(state: State, now = Date.now()): State {
  const s = state.session;
  if (!s || remaining(s, now) > 0 || state.records.some((r) => r.id === s.id))
    return state;
  return {
    ...state,
    leaves: state.leaves + 25,
    records: [
      ...state.records,
      {
        id: s.id,
        completedAt: now,
        minutes: s.duration / 60,
        shared: s.shared,
      },
    ],
    session: null,
  };
}
export function purchase(state: State, item: ItemId, id: string): State {
  if (state.leaves < prices[item] || state.placements.some((p) => p.id === id))
    return state;
  return {
    ...state,
    leaves: state.leaves - prices[item],
    placements: [
      ...state.placements,
      { id, item, area: "home", x: 0.5, y: 0.52 },
    ],
  };
}
function dayKey(t: number) {
  const d = new Date(t);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
function weekStart(t: number) {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.getTime();
}
export function rewards(state: State, now = Date.now()) {
  const date = new Date(now),
    today = dayKey(now),
    week = weekStart(now),
    month = `${date.getFullYear()}-${date.getMonth()}`;
  const weekly = state.records.filter(
    (r) => r.completedAt >= week && r.completedAt <= now,
  );
  const monthly = state.records.filter((r) => {
    const d = new Date(r.completedAt);
    return `${d.getFullYear()}-${d.getMonth()}` === month;
  });
  return [
    {
      id: `day:${today}`,
      label: "GÜNLÜK",
      title: "Bir oturum tamamla",
      value: state.records.filter((r) => dayKey(r.completedAt) === today)
        .length,
      target: 1,
      amount: 15,
    },
    {
      id: `week:${week}`,
      label: "HAFTALIK",
      title: "Kendine üç gün ayır",
      value: new Set(weekly.map((r) => dayKey(r.completedAt))).size,
      target: 3,
      amount: 60,
    },
    {
      id: `month:${month}`,
      label: "AYLIK",
      title: "Dört farklı haftada çalış",
      value: new Set(monthly.map((r) => weekStart(r.completedAt))).size,
      target: 4,
      amount: 150,
    },
  ];
}
export function claim(state: State, id: string, now = Date.now()): State {
  const r = rewards(state, now).find((r) => r.id === id);
  return !r || r.value < r.target || state.claims.includes(id)
    ? state
    : {
        ...state,
        leaves: state.leaves + r.amount,
        claims: [...state.claims, id],
      };
}
export function decode(raw: string | null): State {
  if (!raw) return initialState;
  try {
    const x = JSON.parse(raw);
    if (
      x.version !== 1 ||
      !Number.isFinite(x.state?.leaves) ||
      x.state.leaves < 0 ||
      !Array.isArray(x.state.placements) ||
      !Array.isArray(x.state.records) ||
      !Array.isArray(x.state.claims)
    )
      return initialState;
    return {
      ...initialState,
      ...x.state,
      routine: validRoutine(x.state.routine)
        ? x.state.routine
        : initialState.routine,
      ownedObjects: Array.isArray(x.state.ownedObjects)
        ? x.state.ownedObjects.filter(
            (id: unknown) =>
              Number.isInteger(id) && Number(id) >= 1 && Number(id) <= 40,
          )
        : initialState.ownedObjects,
      objectPlacements: Array.isArray(x.state.objectPlacements)
        ? x.state.objectPlacements.filter(
            (p: ObjectPlacement) =>
              p &&
              Number.isInteger(p.objectId) &&
              ["home", "island"].includes(p.area) &&
              Number.isFinite(p.x) &&
              Number.isFinite(p.y),
          )
        : [],
      notifications:
        typeof x.state.notifications === "boolean"
          ? x.state.notifications
          : true,
    };
  } catch {
    return initialState;
  }
}

export function validRoutine(value: unknown): value is Routine {
  const r = value as Routine;
  return (
    !!r &&
    Number.isInteger(r.minutes) &&
    r.minutes >= 5 &&
    r.minutes <= 240 &&
    Array.isArray(r.days) &&
    r.days.length > 0 &&
    r.days.every((d) => Number.isInteger(d) && d >= 0 && d <= 6)
  );
}
export function setRoutine(state: State, routine: Routine): State {
  return validRoutine(routine)
    ? {
        ...state,
        routine: {
          minutes: routine.minutes,
          days: [...new Set(routine.days)].sort((a, b) => a - b),
        },
      }
    : state;
}
export function buyObject(state: State, id: number, cost: number): State {
  if (
    !Number.isInteger(id) ||
    id < 1 ||
    id > 35 ||
    state.ownedObjects.includes(id) ||
    !Number.isFinite(cost) ||
    cost <= 0 ||
    state.leaves < cost
  )
    return state;
  return {
    ...state,
    leaves: state.leaves - cost,
    ownedObjects: [...state.ownedObjects, id],
  };
}
export function placeObject(
  state: State,
  objectId: number,
  area: "home" | "island",
  x: number,
  y: number,
): State {
  if (
    !state.ownedObjects.includes(objectId) ||
    !["home", "island"].includes(area) ||
    !Number.isFinite(x) ||
    !Number.isFinite(y)
  )
    return state;
  return {
    ...state,
    objectPlacements: [
      ...state.objectPlacements.filter((p) => p.objectId !== objectId),
      {
        objectId,
        area,
        x: Math.max(0.1, Math.min(0.9, x)),
        y: Math.max(0.2, Math.min(0.7, y)),
      },
    ],
  };
}
export function milestoneProgress(state: State, id: number) {
  const days = new Set(
    state.records.map((r) => new Date(r.completedAt).toDateString()),
  ).size;
  const hours = state.records.reduce((n, r) => n + r.minutes, 0) / 60;
  return {
    value: id === 38 ? hours : days,
    target:
      ({ 36: 7, 37: 30, 38: 100, 39: 90, 40: 365 } as Record<number, number>)[
        id
      ] || 1,
    unit: id === 38 ? "saat" : "gün",
  };
}
export function claimObject(state: State, id: number): State {
  const p = milestoneProgress(state, id);
  return id < 36 ||
    id > 40 ||
    state.ownedObjects.includes(id) ||
    p.value < p.target
    ? state
    : { ...state, ownedObjects: [...state.ownedObjects, id] };
}
