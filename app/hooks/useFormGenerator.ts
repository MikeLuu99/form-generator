import { useState, useEffect } from 'react'

type FieldType = 'text' | 'email' | 'number' | 'date'

export interface FormField {
  name: string
  type: FieldType
  label: string
}

export function useFormGenerator(prompt: string): FormField[] {
  const [fields, setFields] = useState<FormField[]>([])

  useEffect(() => {
    if (!prompt) return

    const generatedFields: FormField[] = []

    if (prompt.toLowerCase().includes('name')) {
      generatedFields.push({ name: 'name', type: 'text', label: 'Name' })
    }
    if (prompt.toLowerCase().includes('email')) {
      generatedFields.push({ name: 'email', type: 'email', label: 'Email' })
    }
    if (prompt.toLowerCase().includes('age')) {
      generatedFields.push({ name: 'age', type: 'number', label: 'Age' })
    }
    if (prompt.toLowerCase().includes('date')) {
      generatedFields.push({ name: 'date', type: 'date', label: 'Date' })
    }

    setFields(generatedFields)
  }, [prompt])

  return fields
}

