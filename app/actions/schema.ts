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
    "Combobox",
    "Date Picker",
    "Datetime Picker",
    "File Input",
    "Input",
    "Input OTP",
    "Location Input",
    "Multi Select",
    "Password",
    "Phone",
    "Select",
    "Signature Input",
    "Slider",
    "Smart Datetime Input",
    "Switch",
    "Tags Input",
    "Textarea"
  ])
});

type FormField = z.infer<typeof formFieldSchema>;

export { formFieldSchema, type FormField };