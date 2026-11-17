import { test } from "node:test";
import assert from "node:assert/strict";
import { commonAnchors, coveredPoint } from "../src/features/camera.ts";
test("camera hotspot includes the image cover crop on portrait phones", () => {
  const p = coveredPoint(375, 831, { x: 0.5, y: 0.5 });
  assert.equal(p.x, 187.5);
  assert.equal(p.y, 415.5);
  const edge = coveredPoint(375, 831, { x: 0, y: 0 });
  assert.ok(edge.x < 0);
  assert.equal(edge.y, 0);
});
test("landscape cover crop offsets the vertical hotspot", () => {
  const p = coveredPoint(844, 390, { x: 0.5, y: 0.5 });
  assert.equal(p.x, 422);
  assert.equal(p.y, 195);
});
test("each supported population has a shared area centre", () => {
  assert.equal(commonAnchors.length, 12);
  for (const p of commonAnchors) {
    assert.ok(p.x > 0 && p.x < 1);
    assert.ok(p.y > 0 && p.y < 1);
  }
});
