"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { generateFormResponse } from './actions/jsonOutput'
import DynamicForm from '@/components/ui/dynamicForm'
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import TestData from '@/data/test.json'

interface FormData {
  forms: any[];
  // Add other properties if they exist in the response
}

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [formFields, setFormFields] = useState<FormData | null>(null)
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
      
      console.log('Form fields:', JSON.stringify(result.forms, null, 2))
      setFormFields(result)
    } catch (err) {
      setError("Failed to generate form. Please try again.")
      console.error("Form generation error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleSubmit = async (data: any) => {
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
                disabled={isLoading}
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