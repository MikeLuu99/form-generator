import type { FormField } from '@/types'
import { z } from 'zod'


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

export const generateZodSchema = (fields: FormField[]) => {
  const schemaMap: Record<string, any> = {}
  
  // biome-ignore lint/complexity/noForEach: <explanation>
    fields.forEach((field) => {
    let schema: z.ZodTypeAny

    switch (field.variant) {
      case "Checkbox":
      case "Switch":
        schema = z.boolean().default(field.checked)
        break

      case "Combobox":
        schema = z.string()
          .min(1, "Please select a language")
          .refine((val) => languages.some(lang => lang.value === val), {
            message: "Please select a valid language"
          })
        break

      case "Date Picker":
      case "Datetime Picker":
      case "Smart Datetime Input":
        schema = z.coerce.date({
          required_error: "Please select a date",
          invalid_type_error: "That's not a valid date",
        })
        break

      case "File Input":
        schema = z.instanceof(File).array().optional()
          .refine((files) => {
            if (!files) return true
            return files.every(file => file.size <= 4 * 1024 * 1024)
          }, "Each file must be less than 4MB")
          .refine((files) => {
            if (!files) return true
            return files.length <= 5
          }, "Maximum 5 files allowed")
        break

      case "Input":
        schema = z.string()
          .min(1, "This field is required")
          .transform((val) => val.trim())
        break

      case "Input OTP":
        schema = z.string()
          .length(6, "OTP must be exactly 6 digits")
          .regex(/^\d+$/, "OTP must contain only numbers")
        break

      case "Location Input":
        schema = z.tuple([
          z.string().min(1, "Country is required"),
          z.string().optional()
        ])
        break

      case "Multi Select":
        schema = z.array(z.string())
          .min(1, "Please select at least one option")
          .max(10, "Maximum 10 selections allowed")
        break

      case "Password":
        schema = z.string()
          .min(8, "Password must be at least 8 characters")
          .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
          .regex(/[a-z]/, "Password must contain at least one lowercase letter")
          .regex(/[0-9]/, "Password must contain at least one number")
          .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
        break

      case "Phone":
        schema = z.string()
          .min(1, "Phone number is required")
          .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number")
        break

      case "Select":
        schema = z.string().min(1, "Please select an option")
        break

      case "Signature Input":
        schema = z.string()
          .min(1, "Signature is required")
          .startsWith("data:image/", "Invalid signature format")
        break

      case "Slider":
        schema = z.number()
          .min(field.min || 0)
          .max(field.max || 100)
          .step(field.step || 1)
        break

      case "Tags Input":
        schema = z.array(z.string())
          .min(1, "Please add at least one tag")
          .max(20, "Maximum 20 tags allowed")
          .refine(
            (tags) => tags.every(tag => tag.length <= 50),
            "Each tag must be less than 50 characters"
          )
        break

      case "Textarea":
        schema = z.string()
          .min(1, "This field is required")
          .max(1000, "Maximum 1000 characters allowed")
          .transform((val) => val.trim())
        break

      default:
        schema = z.string()
    }

    if (field.required) {
      schema = schema.superRefine((val, ctx) => {
        if (val === undefined || val === null || val === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `${field.label} is required`,
          })
        }
      })
    } else {
      schema = schema.optional()
    }

    schemaMap[field.name] = schema
  })

  return z.object(schemaMap)
}
