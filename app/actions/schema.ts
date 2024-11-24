import { z } from "zod"

const formFieldSchema = z.object({
  checked: z.boolean().default(true),
  description: z.string().optional(),
  disabled: z.boolean().default(false),
  label: z.string(),
  name: z.string(),
  placeholder: z.string().optional(),
  required: z.boolean().default(false),
  rowIndex: z.number().int().min(0),
  type: z.string().optional(),
  value: z.string().optional(),
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
  ]),
  // Optional properties for specific variants
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  locale: z.string().optional(),
  hour12: z.boolean().optional(),
  className: z.string().optional()
})

type FormField = z.infer<typeof formFieldSchema>

// Extend with specific variant options if needed
const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const

const dropzoneConfig = {
  maxFiles: 5,
  maxSize: 1024 * 1024 * 4, // 4MB
  multiple: true,
}

export { 
  formFieldSchema, 
  type FormField,
  languages,
  dropzoneConfig
}