'use server'

import { generateFormResponse } from './jsonOutput'

export async function submitForm(data: Record<string, any>) {
  // Simulate a delay to mimic server processing
  await new Promise(resolve => setTimeout(resolve, 1000))

  try {
    const response = await generateFormResponse(data)
    return { 
      message: 'Form submitted successfully!',
      response: response 
    }
  } catch (error) {
    return { 
      message: 'Error processing form',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}
