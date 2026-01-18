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
  ToolDefinition,
  ToolSample,
  FormData,
  FormArgs,
  FormField,
} from "./types";

// ============================================================================
// Tool Definition
// ============================================================================

export const TOOL_NAME = "presentForm";

export const TOOL_DEFINITION: ToolDefinition = {
  type: "function",
  name: TOOL_NAME,
  description:
    "Create a structured form to collect information from the user. Supports various field types including text input, textarea, multiple choice (radio), dropdown menus, checkboxes, date/time pickers, and number inputs. Each field can have validation rules and help text.",
  parameters: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "Optional title for the form (e.g., 'User Registration')",
      },
      description: {
        type: "string",
        description: "Optional description explaining the purpose of the form",
      },
      fields: {
        type: "array",
        description:
          "Array of form fields with various types and configurations",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description:
                "Unique identifier for the field (e.g., 'email', 'birthdate'). This will be the key in the JSON response. Use descriptive camelCase or snake_case names.",
            },
            type: {
              type: "string",
              enum: [
                "text",
                "textarea",
                "radio",
                "dropdown",
                "checkbox",
                "date",
                "time",
                "number",
              ],
              description:
                "Field type: 'text' for short text, 'textarea' for long text, 'radio' for 2-6 choices, 'dropdown' for many choices, 'checkbox' for multiple selections, 'date' for date picker, 'time' for time picker, 'number' for numeric input",
            },
            label: {
              type: "string",
              description: "Field label shown to the user",
            },
            description: {
              type: "string",
              description: "Optional help text explaining the field",
            },
            required: {
              type: "boolean",
              description: "Whether the field is required (default: false)",
            },
            placeholder: {
              type: "string",
              description: "Placeholder text for text/textarea fields",
            },
            validation: {
              type: "string",
              description:
                "For text fields: 'email', 'url', 'phone', or a regex pattern",
            },
            minLength: {
              type: "number",
              description: "Minimum character length for textarea fields",
            },
            maxLength: {
              type: "number",
              description: "Maximum character length for textarea fields",
            },
            rows: {
              type: "number",
              description: "Number of visible rows for textarea (default: 4)",
            },
            choices: {
              type: "array",
              items: { type: "string" },
              description:
                "Array of choices for radio/dropdown/checkbox fields. Radio should have 2-6 choices, dropdown for 7+ choices.",
            },
            searchable: {
              type: "boolean",
              description: "Make dropdown searchable (for large lists)",
            },
            minSelections: {
              type: "number",
              description: "Minimum number of selections for checkbox fields",
            },
            maxSelections: {
              type: "number",
              description: "Maximum number of selections for checkbox fields",
            },
            minDate: {
              type: "string",
              description: "Minimum date (ISO format: YYYY-MM-DD)",
            },
            maxDate: {
              type: "string",
              description: "Maximum date (ISO format: YYYY-MM-DD)",
            },
            format: {
              type: "string",
              description: "Format for time fields: '12hr' or '24hr'",
            },
            min: {
              type: "number",
              description: "Minimum value for number fields",
            },
            max: {
              type: "number",
              description: "Maximum value for number fields",
            },
            step: {
              type: "number",
              description: "Step increment for number fields",
            },
            defaultValue: {
              description:
                "Optional default/pre-filled value for the field. Type varies by field: string for text/textarea/radio/dropdown/date/time, number for number fields, array of strings for checkbox fields. For radio/dropdown, must be one of the choices. For checkbox, must be a subset of choices.",
            },
          },
          required: ["id", "type", "label"],
        },
        minItems: 1,
      },
    },
    required: ["fields"],
  },
};

// ============================================================================
// Sample Data
// ============================================================================

export const SAMPLES: ToolSample[] = [
  {
    name: "Contact Form",
    args: {
      title: "Contact Us",
      description: "Please fill out the form below to get in touch.",
      fields: [
        {
          id: "name",
          type: "text",
          label: "Full Name",
          required: true,
          placeholder: "John Doe",
        },
        {
          id: "email",
          type: "text",
          label: "Email Address",
          required: true,
          placeholder: "john@example.com",
          validation: "email",
        },
        {
          id: "subject",
          type: "dropdown",
          label: "Subject",
          choices: [
            "General Inquiry",
            "Technical Support",
            "Sales",
            "Feedback",
          ],
          required: true,
        },
        {
          id: "message",
          type: "textarea",
          label: "Message",
          required: true,
          minLength: 10,
          maxLength: 500,
          rows: 5,
        },
      ],
    },
  },
  {
    name: "Survey Form",
    args: {
      title: "Customer Satisfaction Survey",
      fields: [
        {
          id: "satisfaction",
          type: "radio",
          label: "How satisfied are you with our service?",
          choices: [
            "Very Satisfied",
            "Satisfied",
            "Neutral",
            "Dissatisfied",
            "Very Dissatisfied",
          ],
          required: true,
        },
        {
          id: "features",
          type: "checkbox",
          label: "Which features do you use most?",
          choices: [
            "Dashboard",
            "Reports",
            "Analytics",
            "API",
            "Integrations",
          ],
          minSelections: 1,
          maxSelections: 3,
        },
        {
          id: "recommendation",
          type: "number",
          label: "How likely are you to recommend us? (0-10)",
          min: 0,
          max: 10,
          step: 1,
        },
      ],
    },
  },
  {
    name: "Event Registration",
    args: {
      title: "Event Registration",
      description: "Register for our upcoming conference.",
      fields: [
        {
          id: "attendeeName",
          type: "text",
          label: "Attendee Name",
          required: true,
        },
        {
          id: "eventDate",
          type: "date",
          label: "Preferred Date",
          required: true,
          minDate: "2025-01-01",
          maxDate: "2025-12-31",
        },
        {
          id: "sessionTime",
          type: "time",
          label: "Session Time",
          format: "12hr",
        },
        {
          id: "dietaryRestrictions",
          type: "checkbox",
          label: "Dietary Restrictions",
          choices: ["Vegetarian", "Vegan", "Gluten-Free", "Halal", "Kosher"],
        },
      ],
    },
  },
];

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
