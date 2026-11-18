import { test } from "node:test";
import assert from "node:assert/strict";
import {
  initialState,
  setRoutine,
  decode,
  buyObject,
  placeObject,
  claimObject,
} from "../src/state/model.ts";
test("routine edits keep scheduled state and reject empty days", () => {
  const changed = setRoutine(initialState, { minutes: 90, days: [4, 0, 0] });
  assert.deepEqual(changed.routine, { minutes: 90, days: [0, 4] });
  assert.equal(changed.records, initialState.records);
  assert.equal(setRoutine(changed, { minutes: 90, days: [] }), changed);
  assert.equal(setRoutine(changed, { minutes: 0, days: [0] }), changed);
});
test("existing v1 storage migrates to the new routine and collection safely", () => {
  const { routine, ownedObjects, objectPlacements, notifications, ...old } =
    initialState;
  const restored = decode(JSON.stringify({ version: 1, state: old }));
  assert.equal(restored.routine.minutes, 75);
  assert.equal(restored.ownedObjects.length, 12);
  assert.deepEqual(restored.objectPlacements, []);
  assert.equal(restored.leaves, old.leaves);
});
test("routine and object placement survive a persisted round trip", () => {
  const changed = placeObject(
    setRoutine(initialState, { minutes: 120, days: [1, 3] }),
    12,
    "island",
    0.4,
    0.6,
  );
  const restored = decode(JSON.stringify({ version: 1, state: changed }));
  assert.deepEqual(restored.routine, changed.routine);
  assert.deepEqual(restored.objectPlacements, changed.objectPlacements);
});
test("object purchases charge exactly once and cannot overspend", () => {
  const bought = buyObject(initialState, 2, 80);
  assert.equal(bought.leaves, 160);
  assert.ok(bought.ownedObjects.includes(2));
  assert.equal(buyObject(bought, 2, 80), bought);
  assert.equal(buyObject(initialState, 3, 500), initialState);
  assert.equal(buyObject(initialState, 3, -20), initialState);
});
test("moving an object retains ownership and a single placement", () => {
  const first = placeObject(initialState, 12, "home", 0.4, 0.5),
    shared = placeObject(first, 12, "island", 0.6, 0.55);
  assert.equal(shared.objectPlacements.length, 1);
  assert.equal(shared.objectPlacements[0].area, "island");
  assert.ok(shared.ownedObjects.includes(12));
  assert.equal(placeObject(initialState, 2, "home", 0.5, 0.5), initialState);
});
test("milestone objects cannot be claimed before work or repeatedly", () => {
  assert.equal(claimObject(initialState, 37), initialState);
  const state = {
    ...initialState,
    records: Array.from({ length: 30 }, (_, i) => ({
      id: String(i),
      completedAt: new Date(2026, 9, i + 1).getTime(),
      minutes: 25,
      shared: false,
    })),
  };
  const claimed = claimObject(state, 37);
  assert.ok(claimed.ownedObjects.includes(37));
  assert.equal(claimObject(claimed, 37), claimed);
});
