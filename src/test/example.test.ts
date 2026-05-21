import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

describe("example", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });
});

describe("enrollment email assets", () => {
  const functionSource = readFileSync(
    join(process.cwd(), "supabase/functions/send-enrollment-notifications/index.ts"),
    "utf8"
  );

  it("does not reference the removed generic banner", () => {
    expect(functionSource).not.toContain("EMAIL_BANNER_URL");
  });

  it("uses cache-busted desktop and mobile program banners", () => {
    expect(functionSource).toContain("${slug}-desktop.jpg?v=${EMAIL_ASSET_VERSION}");
    expect(functionSource).toContain("${slug}-mobile.jpg?v=${EMAIL_ASSET_VERSION}");
    expect(functionSource).not.toMatch(/EMAIL_PLAN_IMAGE_BASE\}\/[a-z-]+-desktop\.jpg`/);
  });
});
