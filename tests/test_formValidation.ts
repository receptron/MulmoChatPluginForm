// What `executeForm` accepts, and what it refuses.
//
// The definition arrives from a model, so these rules are the only thing between
// a bad field and a form the user cannot complete. There was no test for any of
// them — the validation is the whole of what this plugin's core does, and it was
// checked only by reading.
//
// Both directions for each rule: the case that must be REFUSED and the valid
// neighbour that must still be ACCEPTED. A validator that refuses everything
// passes a one-directional suite.

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { executeForm } from "../src/core/plugin";
import type { FormArgs } from "../src/core/types";

const context = {} as never;

/** The message the definition produced — a refusal starts with `Form error`. */
const messageFor = async (fields: unknown[]): Promise<string> => {
  const args = { title: "T", fields } as unknown as FormArgs;
  const result = await executeForm(context, args);
  return result.message;
};

const accepts = async (fields: unknown[]): Promise<boolean> => !(await messageFor(fields)).startsWith("Form error");

describe("executeForm — the shape of a field", () => {
  it("accepts one field of every type it renders", async () => {
    assert.ok(
      await accepts([
        { id: "a", type: "text", label: "A" },
        { id: "b", type: "textarea", label: "B" },
        { id: "c", type: "radio", label: "C", choices: ["x", "y"] },
        { id: "d", type: "dropdown", label: "D", choices: ["x"] },
        { id: "e", type: "checkbox", label: "E", choices: ["x", "y"] },
        { id: "f", type: "date", label: "F" },
        { id: "g", type: "time", label: "G" },
        { id: "h", type: "number", label: "H" },
      ]),
      "refused a valid form",
    );
  });

  it("refuses a form with no fields", async () => {
    assert.match(await messageFor([]), /At least one field is required/);
  });

  it("refuses a missing id, label or type", async () => {
    assert.match(await messageFor([{ type: "text", label: "A" }]), /must have a valid 'id' property/);
    assert.match(await messageFor([{ id: "a", type: "text" }]), /must have a valid 'label' property/);
    assert.match(await messageFor([{ id: "a", label: "A" }]), /must have a valid 'type' property/);
  });

  it("refuses a duplicate id and an unknown type", async () => {
    const duplicated = [
      { id: "a", type: "text", label: "A" },
      { id: "a", type: "text", label: "B" },
    ];
    assert.match(await messageFor(duplicated), /Duplicate field ID: 'a'/);
    assert.match(await messageFor([{ id: "a", type: "hologram", label: "A" }]), /unknown field type 'hologram'/);
  });
});

describe("executeForm — ranges a field declares", () => {
  it("accepts ranges that can be satisfied", async () => {
    assert.ok(await accepts([{ id: "a", type: "text", label: "A", minLength: 2, maxLength: 6 }]), "refused a valid range");
    assert.ok(await accepts([{ id: "b", type: "checkbox", label: "B", choices: ["x", "y"], minSelections: 1, maxSelections: 2 }]), "refused a valid range");
  });

  it("refuses inverted ranges", async () => {
    assert.match(await messageFor([{ id: "a", type: "text", label: "A", minLength: 9, maxLength: 2 }]), /minLength cannot be greater than maxLength/);
    assert.match(await messageFor([{ id: "a", type: "number", label: "A", min: 9, max: 2 }]), /min cannot be greater than max/);
    assert.match(await messageFor([{ id: "a", type: "date", label: "A", minDate: "2026-09-01", maxDate: "2026-01-01" }]), /minDate cannot be after maxDate/);
    assert.match(
      await messageFor([{ id: "a", type: "checkbox", label: "A", choices: ["x", "y"], minSelections: 2, maxSelections: 1 }]),
      /minSelections cannot be greater than maxSelections/,
    );
  });

  // Both of these render a form nobody can submit: the user is asked for more
  // selections than there are boxes to tick.
  it("refuses selection counts the choices cannot satisfy", async () => {
    assert.match(await messageFor([{ id: "a", type: "checkbox", label: "A", choices: ["x"], maxSelections: 2 }]), /maxSelections cannot exceed number of choices/);
    assert.match(await messageFor([{ id: "a", type: "checkbox", label: "A", choices: ["x"], minSelections: 2 }]), /minSelections cannot exceed number of choices/);
  });

  it("refuses too few choices", async () => {
    assert.match(await messageFor([{ id: "a", type: "radio", label: "A", choices: ["x"] }]), /radio fields must have at least 2 choices/);
    assert.match(await messageFor([{ id: "a", type: "dropdown", label: "A", choices: [] }]), /must have at least 1 choice/);
  });
});

describe("executeForm — defaultValue", () => {
  it("accepts a default each field can actually hold", async () => {
    assert.ok(
      await accepts([
        { id: "a", type: "text", label: "A", minLength: 2, maxLength: 6, defaultValue: "abcd" },
        { id: "b", type: "radio", label: "B", choices: ["x", "y"], defaultValue: "y" },
        { id: "c", type: "checkbox", label: "C", choices: ["x", "y", "z"], minSelections: 1, maxSelections: 2, defaultValue: ["x", "z"] },
        { id: "d", type: "number", label: "D", min: 1, max: 10, defaultValue: 5 },
        { id: "e", type: "date", label: "E", minDate: "2026-01-01", maxDate: "2026-12-31", defaultValue: "2026-06-06" },
        { id: "f", type: "time", label: "F", defaultValue: "09:30" },
      ]),
      "refused a valid set of defaults",
    );
  });

  it("refuses a default of the wrong type", async () => {
    assert.match(await messageFor([{ id: "a", type: "text", label: "A", defaultValue: 42 }]), /defaultValue must be a string/);
    assert.match(await messageFor([{ id: "a", type: "number", label: "A", defaultValue: "5" }]), /defaultValue must be a number/);
    assert.match(await messageFor([{ id: "a", type: "date", label: "A", defaultValue: 20260606 }]), /ISO date format/);
    assert.match(await messageFor([{ id: "a", type: "checkbox", label: "A", choices: ["x"], defaultValue: "x" }]), /defaultValue must be an array/);
  });

  it("refuses a default outside the choices", async () => {
    assert.match(await messageFor([{ id: "a", type: "radio", label: "A", choices: ["x", "y"], defaultValue: "z" }]), /defaultValue 'z' is not in choices/);
    assert.match(await messageFor([{ id: "a", type: "checkbox", label: "A", choices: ["x"], defaultValue: ["x", "q"] }]), /contains 'q' which is not in choices/);
  });

  it("refuses a default outside the range the same field declares", async () => {
    assert.match(await messageFor([{ id: "a", type: "text", label: "A", minLength: 4, defaultValue: "ab" }]), /length is less than minLength/);
    assert.match(await messageFor([{ id: "a", type: "text", label: "A", maxLength: 3, defaultValue: "abcdefg" }]), /length exceeds maxLength/);
    assert.match(await messageFor([{ id: "a", type: "number", label: "A", min: 3, defaultValue: 1 }]), /defaultValue is less than min/);
    assert.match(await messageFor([{ id: "a", type: "number", label: "A", max: 3, defaultValue: 9 }]), /defaultValue is greater than max/);
    assert.match(await messageFor([{ id: "a", type: "date", label: "A", minDate: "2026-02-01", defaultValue: "2026-01-01" }]), /is before minDate/);
    assert.match(await messageFor([{ id: "a", type: "date", label: "A", maxDate: "2026-02-01", defaultValue: "2026-03-01" }]), /is after maxDate/);
  });

  it("refuses a default with the wrong number of selections", async () => {
    assert.match(
      await messageFor([{ id: "a", type: "checkbox", label: "A", choices: ["x", "y"], minSelections: 2, defaultValue: ["x"] }]),
      /fewer selections than minSelections/,
    );
    assert.match(
      await messageFor([{ id: "a", type: "checkbox", label: "A", choices: ["x", "y"], maxSelections: 1, defaultValue: ["x", "y"] }]),
      /more selections than maxSelections/,
    );
  });
});

// The browser blanks a value its input cannot parse, so a form with an
// unparseable default opens empty while the definition still claims one.
describe("executeForm — a date or time the input cannot hold", () => {
  it("accepts a real date and a well-formed time", async () => {
    assert.ok(await accepts([{ id: "a", type: "date", label: "A", defaultValue: "2026-02-28" }]), "refused a real date");
    assert.ok(await accepts([{ id: "b", type: "time", label: "B", defaultValue: "23:59" }]), "refused a valid time");
    assert.ok(await accepts([{ id: "c", type: "time", label: "C", defaultValue: "08:05:30" }]), "refused a valid time with seconds");
  });

  it("refuses a date that is not YYYY-MM-DD, and a day that does not exist", async () => {
    assert.match(await messageFor([{ id: "a", type: "date", label: "A", defaultValue: "06/06/2026" }]), /must be a date in YYYY-MM-DD form/);
    assert.match(await messageFor([{ id: "a", type: "date", label: "A", defaultValue: "2026-02-30" }]), /is not a real date/);
  });

  it("refuses a bound that is not a real date either", async () => {
    assert.match(await messageFor([{ id: "a", type: "date", label: "A", minDate: "2026-02-30" }]), /minDate '2026-02-30' is not a real date/);
    assert.match(await messageFor([{ id: "a", type: "date", label: "A", maxDate: "tomorrow" }]), /maxDate must be a date in YYYY-MM-DD form/);
  });

  it("refuses a time outside the clock", async () => {
    assert.match(await messageFor([{ id: "a", type: "time", label: "A", defaultValue: "25:90" }]), /must be a time in HH:MM form/);
    assert.match(await messageFor([{ id: "a", type: "time", label: "A", defaultValue: "9:30" }]), /must be a time in HH:MM form/);
  });
});

// The view ticks by index, so a repeat is one tick, two against the count rules,
// and two entries in what is submitted.
describe("executeForm — a repeated checkbox default", () => {
  it("accepts distinct selections", async () => {
    assert.ok(await accepts([{ id: "a", type: "checkbox", label: "A", choices: ["x", "y"], defaultValue: ["x", "y"] }]), "refused distinct selections");
  });

  it("refuses a repeat", async () => {
    assert.match(await messageFor([{ id: "a", type: "checkbox", label: "A", choices: ["x", "y"], defaultValue: ["x", "x"] }]), /must not repeat a selection/);
  });
});
