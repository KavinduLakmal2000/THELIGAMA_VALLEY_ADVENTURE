const test = require("node:test");
const assert = require("node:assert/strict");

const { isR2ImageUrl, normalizeActivityImageUrl } = require("../services/r2Service");

process.env.R2_PUBLIC_URL = "https://images.example.com";

test("recognizes R2 public URLs and leaves legacy filenames alone", () => {
  assert.equal(isR2ImageUrl("https://images.example.com/activities/test.jpg"), true);
  assert.equal(isR2ImageUrl("legacy-file.jpg"), false);
  assert.equal(normalizeActivityImageUrl("legacy-file.jpg"), "legacy-file.jpg");
  assert.equal(
    normalizeActivityImageUrl("https://images.example.com/activities/test.jpg"),
    "https://images.example.com/activities/test.jpg"
  );
});
