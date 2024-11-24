import { z } from "zod";

const formFieldSchema = z.object({
  checked: z.boolean(),
  description: z.string(),
  disabled: z.boolean(),
  label: z.string(),
  name: z.string(),
  placeholder: z.string(),
  required: z.boolean(),
  rowIndex: z.number().int().min(0),
  type: z.string(),
  value: z.string(),
  variant: z.enum([
    "Checkbox",
    "Input",
    "Calendar",
    "Text Area",
    "Date Picker",
    "Input"
  ])
});

type FormField = z.infer<typeof formFieldSchema>;

export { formFieldSchema, type FormField };