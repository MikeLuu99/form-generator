"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateFormResponse } from './actions/jsonOutput'
import DynamicForm from '@/components/dynamicForm'
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { FormField } from '@/components/dynamicForm' // Import the FormField type

interface FormResponse {
  forms: FormField[];
}

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [formFields, setFormFields] = useState<FormResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateForm = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt first")
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const result = await generateFormResponse(prompt)
      
      // Validate and transform the API response
      const validatedFields = result.forms.map((field: any) => ({
        checked: field.checked ?? false,
        description: field.description ?? "",
        disabled: field.disabled ?? false,
        label: field.label ?? "Untitled",
        name: field.name ?? `field_${Math.random().toString(36).slice(2)}`,
        placeholder: field.placeholder ?? "",
        required: field.required ?? false,
        rowIndex: field.rowIndex ?? 0,
        type: field.type ?? "text",
        value: field.value ?? "",
        variant: field.variant ?? "Input",
        // Optional properties
        min: field.min,
        max: field.max,
        step: field.step,
        locale: field.locale,
        hour12: field.hour12,
        className: field.className
      })) as FormField[]

      setFormFields({ forms: validatedFields })
      
      console.log('Form fields:', JSON.stringify(validatedFields, null, 2))
    } catch (err) {
      setError("Failed to generate form. Please try again.")
      console.error("Form generation error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      console.log('Form submitted:', data)
      // Handle form submission here
    } catch (err) {
      console.error("Form submission error:", err)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Dynamic Form Generator</h1>
          <p className="text-muted-foreground">
            Enter a prompt to generate a custom form with your specified fields.
          </p>
        </div>

        {/* Prompt Input Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Form Prompt</Label>
            <div className="flex gap-2">
              <Input
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Create a form with name, email, and age fields"
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={handleGenerateForm} 
                disabled={isLoading || !prompt.trim()}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'Generating...' : 'Generate Form'}
              </Button>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Generated Form Display */}
        {formFields?.forms && formFields.forms.length > 0 && (
          <div className="border rounded-lg p-6 space-y-6 bg-card">
            <h2 className="text-xl font-semibold">Generated Form</h2>
            <DynamicForm 
              fields={formFields.forms} 
              onSubmit={handleSubmit} 
            />
          </div>
        )}
      </div>
    </div>
  )
}