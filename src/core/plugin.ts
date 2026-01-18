/**
 * MulmoChat Form Plugin Core (Framework-agnostic)
 *
 * Contains the plugin logic without UI components.
 * Can be used by any framework (Vue, React, etc.)
 */

import type {
  ToolPluginCore,
  ToolContext,
  ToolResult,
  FormData,
  FormArgs,
  FormField,
} from "./types";
import { TOOL_DEFINITION } from "./definition";
import { SAMPLES } from "./samples";

// Re-export for convenience
export { TOOL_NAME, TOOL_DEFINITION } from "./definition";
export { SAMPLES } from "./samples";

// ============================================================================
// Execute Function
// ============================================================================

export const executeForm = async (
  _context: ToolContext,
  args: FormArgs,
): Promise<ToolResult<never, FormData>> => {
  try {
    const { title, description, fields } = args;

    if (!fields || !Array.isArray(fields) || fields.length === 0) {
      throw new Error("At least one field is required");
    }

    // Validate fields
    const fieldIds = new Set<string>();
    for (let i = 0; i < fields.length; i++) {
      const field = fields[i];

      // Check required properties
      if (!field.id || typeof field.id !== "string") {
        throw new Error(`Field ${i + 1} must have a valid 'id' property`);
      }
      if (!field.type || typeof field.type !== "string") {
        throw new Error(`Field ${i + 1} must have a valid 'type' property`);
      }
      if (!field.label || typeof field.label !== "string") {
        throw new Error(`Field ${i + 1} must have a valid 'label' property`);
      }

      // Check for duplicate IDs
      if (fieldIds.has(field.id)) {
        throw new Error(`Duplicate field ID: '${field.id}'`);
      }
      fieldIds.add(field.id);

      // Validate type-specific properties
      switch (field.type) {
        case "text":
        case "textarea":
          // Valid text fields
          if (field.minLength !== undefined && field.maxLength !== undefined) {
            if (field.minLength > field.maxLength) {
              throw new Error(
                `Field '${field.id}': minLength cannot be greater than maxLength`,
              );
            }
          }
          break;

        case "radio":
          if (!Array.isArray(field.choices) || field.choices.length < 2) {
            throw new Error(
              `Field '${field.id}': radio fields must have at least 2 choices`,
            );
          }
          if (field.choices.length > 6) {
            console.warn(
              `Field '${field.id}': radio fields with more than 6 choices should use 'dropdown' type instead`,
            );
          }
          break;

        case "dropdown":
        case "checkbox":
          if (!Array.isArray(field.choices) || field.choices.length < 1) {
            throw new Error(
              `Field '${field.id}': ${field.type} fields must have at least 1 choice`,
            );
          }
          break;

        case "number":
          if (field.min !== undefined && field.max !== undefined) {
            if (field.min > field.max) {
              throw new Error(
                `Field '${field.id}': min cannot be greater than max`,
              );
            }
          }
          break;

        case "date":
          if (field.minDate && field.maxDate) {
            if (field.minDate > field.maxDate) {
              throw new Error(
                `Field '${field.id}': minDate cannot be after maxDate`,
              );
            }
          }
          break;

        case "time":
          // Valid time field
          break;

        default: {
          const unknownField = field as FormField;
          throw new Error(
            `Field '${unknownField.id}': unknown field type '${unknownField.type}'`,
          );
        }
      }

      // Validate checkbox constraints
      if (field.type === "checkbox") {
        if (
          field.minSelections !== undefined &&
          field.maxSelections !== undefined
        ) {
          if (field.minSelections > field.maxSelections) {
            throw new Error(
              `Field '${field.id}': minSelections cannot be greater than maxSelections`,
            );
          }
        }
        if (
          field.maxSelections !== undefined &&
          field.maxSelections > field.choices.length
        ) {
          throw new Error(
            `Field '${field.id}': maxSelections cannot exceed number of choices`,
          );
        }
      }

      // Validate defaultValue
      if (field.defaultValue !== undefined) {
        switch (field.type) {
          case "text":
          case "textarea":
            if (typeof field.defaultValue !== "string") {
              throw new Error(
                `Field '${field.id}': defaultValue must be a string`,
              );
            }
            if (
              field.minLength !== undefined &&
              field.defaultValue.length < field.minLength
            ) {
              throw new Error(
                `Field '${field.id}': defaultValue length is less than minLength`,
              );
            }
            if (
              field.maxLength !== undefined &&
              field.defaultValue.length > field.maxLength
            ) {
              throw new Error(
                `Field '${field.id}': defaultValue length exceeds maxLength`,
              );
            }
            break;

          case "radio":
          case "dropdown":
            if (typeof field.defaultValue !== "string") {
              throw new Error(
                `Field '${field.id}': defaultValue must be a string`,
              );
            }
            if (!field.choices.includes(field.defaultValue)) {
              throw new Error(
                `Field '${field.id}': defaultValue '${field.defaultValue}' is not in choices`,
              );
            }
            break;

          case "checkbox":
            if (!Array.isArray(field.defaultValue)) {
              throw new Error(
                `Field '${field.id}': defaultValue must be an array`,
              );
            }
            for (const value of field.defaultValue) {
              if (!field.choices.includes(value)) {
                throw new Error(
                  `Field '${field.id}': defaultValue contains '${value}' which is not in choices`,
                );
              }
            }
            if (
              field.minSelections !== undefined &&
              field.defaultValue.length < field.minSelections
            ) {
              throw new Error(
                `Field '${field.id}': defaultValue has fewer selections than minSelections`,
              );
            }
            if (
              field.maxSelections !== undefined &&
              field.defaultValue.length > field.maxSelections
            ) {
              throw new Error(
                `Field '${field.id}': defaultValue has more selections than maxSelections`,
              );
            }
            break;

          case "number":
            if (typeof field.defaultValue !== "number") {
              throw new Error(
                `Field '${field.id}': defaultValue must be a number`,
              );
            }
            if (field.min !== undefined && field.defaultValue < field.min) {
              throw new Error(
                `Field '${field.id}': defaultValue is less than min`,
              );
            }
            if (field.max !== undefined && field.defaultValue > field.max) {
              throw new Error(
                `Field '${field.id}': defaultValue is greater than max`,
              );
            }
            break;

          case "date":
            if (typeof field.defaultValue !== "string") {
              throw new Error(
                `Field '${field.id}': defaultValue must be a string (ISO date format)`,
              );
            }
            if (
              field.minDate !== undefined &&
              field.defaultValue < field.minDate
            ) {
              throw new Error(
                `Field '${field.id}': defaultValue is before minDate`,
              );
            }
            if (
              field.maxDate !== undefined &&
              field.defaultValue > field.maxDate
            ) {
              throw new Error(
                `Field '${field.id}': defaultValue is after maxDate`,
              );
            }
            break;

          case "time":
            if (typeof field.defaultValue !== "string") {
              throw new Error(
                `Field '${field.id}': defaultValue must be a string`,
              );
            }
            break;
        }
      }
    }

    const formData: FormData = {
      title,
      description,
      fields,
    };

    const fieldCount = `${fields.length} field${fields.length > 1 ? "s" : ""}`;
    const titleSuffix = title ? `: ${title}` : "";
    const message = `Form created with ${fieldCount}${titleSuffix}`;

    return {
      message,
      jsonData: formData,
      instructions:
        "The form has been presented to the user. Wait for the user to fill out and submit the form. They will send their responses as a JSON message.",
    };
  } catch (error) {
    console.error("ERR: exception\n Form creation error", error);
    return {
      message: `Form error: ${error instanceof Error ? error.message : "Unknown error"}`,
      instructions:
        "Acknowledge that there was an error creating the form and suggest trying again with corrected field definitions.",
    };
  }
};

// ============================================================================
// Core Plugin (without UI components)
// ============================================================================

export const pluginCore: ToolPluginCore<never, FormData, FormArgs> = {
  toolDefinition: TOOL_DEFINITION,
  execute: executeForm,
  generatingMessage: "Preparing form...",
  isEnabled: () => true,
  samples: SAMPLES,
};
