import { test } from "node:test";
import assert from "node:assert/strict";
import {
  capacity,
  decodeWorld,
  emptyWorld,
  joinWorld,
} from "../src/features/world-model.ts";
test("free capacity includes owner; ninth invitation cannot join", () => {
  const s = { ...emptyWorld, members: 8 };
  assert.equal(capacity(s), 8);
  assert.equal(joinWorld(s, "KIYI27").error, "full");
  assert.equal(joinWorld(s, "KIYI27").state, s);
});
test("premium capacity stops at twelve; invalid codes never change membership", () => {
  const s = { ...emptyWorld, members: 11, premium: "annual" as const };
  assert.equal(joinWorld(s, "wrong").state, s);
  const result = joinWorld(s, " kiyi27 ");
  assert.equal(result.state.members, 12);
  assert.equal(joinWorld(result.state, "KIYI27").error, "full");
});
test("old or corrupt world storage is rejected", () => {
  assert.equal(decodeWorld("broken"), emptyWorld);
  assert.equal(
    decodeWorld(JSON.stringify({ ...emptyWorld, members: 12 })),
    emptyWorld,
  );
  assert.equal(
    decodeWorld(JSON.stringify({ ...emptyWorld, premium: "fake" })),
    emptyWorld,
  );
});
