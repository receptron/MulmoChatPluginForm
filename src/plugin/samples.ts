/**
 * Form Sample Data
 */

import type { ToolSample } from "../common";

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
