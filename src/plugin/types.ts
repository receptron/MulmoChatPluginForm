/**
 * Form Tool Definition and Types
 */

// ============================================================================
// Types
// ============================================================================

/** Field type discriminator */
export type FieldType =
  | "text"
  | "textarea"
  | "radio"
  | "dropdown"
  | "checkbox"
  | "date"
  | "time"
  | "number";

/** Base field interface */
export interface BaseField {
  id: string;
  type: FieldType;
  label: string;
  description?: string;
  required?: boolean;
  maxLength?: number;
}

/** Text field */
export interface TextField extends BaseField {
  type: "text";
  placeholder?: string;
  validation?: "email" | "url" | "phone" | string;
  defaultValue?: string;
  minLength?: number;
  maxLength?: number;
}

/** Textarea field */
export interface TextareaField extends BaseField {
  type: "textarea";
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  rows?: number;
  defaultValue?: string;
}

/** Radio field */
export interface RadioField extends BaseField {
  type: "radio";
  choices: string[];
  defaultValue?: string;
}

/** Dropdown field */
export interface DropdownField extends BaseField {
  type: "dropdown";
  choices: string[];
  searchable?: boolean;
  defaultValue?: string;
}

/** Checkbox field */
export interface CheckboxField extends BaseField {
  type: "checkbox";
  choices: string[];
  minSelections?: number;
  maxSelections?: number;
  defaultValue?: string[];
}

/** Date field */
export interface DateField extends BaseField {
  type: "date";
  minDate?: string;
  maxDate?: string;
  format?: string;
  defaultValue?: string;
}

/** Time field */
export interface TimeField extends BaseField {
  type: "time";
  format?: "12hr" | "24hr";
  defaultValue?: string;
}

/** Number field */
export interface NumberField extends BaseField {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
}

/** Union type for all fields */
export type FormField =
  | TextField
  | TextareaField
  | RadioField
  | DropdownField
  | CheckboxField
  | DateField
  | TimeField
  | NumberField;

/** Form data stored in result.jsonData */
export interface FormData {
  title?: string;
  description?: string;
  fields: FormField[];
}

/** Arguments passed to the form tool */
export interface FormArgs {
  title?: string;
  description?: string;
  fields: FormField[];
}

// ============================================================================
// Tool Definition
// ============================================================================

export const TOOL_NAME = "presentForm";

export const TOOL_DEFINITION = {
  type: "function" as const,
  name: TOOL_NAME,
  description:
    "Create a structured form to collect information from the user. Supports various field types including text input, textarea, multiple choice (radio), dropdown menus, checkboxes, date/time pickers, and number inputs. Each field can have validation rules and help text.",
  parameters: {
    type: "object" as const,
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
