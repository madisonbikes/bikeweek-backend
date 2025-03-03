import { eventDaysArraySchema } from "./types";
import { z } from "zod";

const testTimestampSchema = z.coerce.date();
describe("event schema", () => {
  const ISO_TIMESTAMP = "2014-02-11T11:30:30";

  it("parses timestamp as string", () => {
    expect(testTimestampSchema.parse(ISO_TIMESTAMP)).toEqual(
      new Date(ISO_TIMESTAMP),
    );
  });

  it("parses timestamp as date", () => {
    expect(testTimestampSchema.parse(new Date(ISO_TIMESTAMP))).toEqual(
      new Date(ISO_TIMESTAMP),
    );
  });

  it("parses timestamp as integer", () => {
    expect(testTimestampSchema.safeParse(5).success).toBe(true);
  });

  it("parses event days as string", () => {
    expect(eventDaysArraySchema.parse(["2014-02-11"])).toEqual([
      new Date("2014-02-11T00:00:00.000Z"),
    ]);
  });

  it("parses event days/dates as string", () => {
    expect(
      eventDaysArraySchema.safeParse([new Date(ISO_TIMESTAMP)]).success,
    ).toBe(true);
  });

  it("parses event days/dates as string", () => {
    expect(eventDaysArraySchema.safeParse([ISO_TIMESTAMP]).success).toBe(true);
  });
});
