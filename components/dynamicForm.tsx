"use client"

import type React from "react"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Calendar as CalendarIcon, CloudUpload, Paperclip } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import { MultiSelector, MultiSelectorContent, MultiSelectorInput, MultiSelectorItem, MultiSelectorList, MultiSelectorTrigger } from "@/components/ui/multi-select"
import { TagsInput } from "@/components/ui/tags-input"
import { Slider } from "@/components/ui/slider"
import { PhoneInput } from "@/components/ui/phone-input"
import { PasswordInput } from "@/components/ui/password-input"
import { FileUploader, FileUploaderContent, FileUploaderItem, FileInput } from "@/components/ui/file-upload"
import { DatetimePicker } from "@/components/ui/datetime-picker"
import { SmartDatetimeInput } from "@/components/ui/smart-datetime-input"
import LocationSelector from "@/components/ui/location-input"
import SignatureInput from "@/components/ui/signature-input"

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

import type { FormField, DynamicFormProps } from '@/types'

import { generateZodSchema } from '@/lib/form-utils'

const FileSvgDraw = () => {
  return (
    <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full">
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        SVG, PNG, JPG or GIF
      </p>
    </div>
  )
}

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, onSubmit }) => {
  const [files, setFiles] = useState<File[] | null>(null)
  const [countryName, setCountryName] = useState("")
  const [stateName, setStateName] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const formSchema = generateZodSchema(fields)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const renderFormField = (field: FormField) => {
    const [fieldValue, setFieldValue] = useState<any>(field.value)
    const [checked, setChecked] = useState<boolean>(field.checked)
    const [selectedValues, setSelectedValues] = useState<string[]>(["React"])
    const [tagsValue, setTagsValue] = useState<string[]>([])

    const commonProps = {
      control: form.control,
      name: field.name,
      key: field.name,
    }

    const renderMap: Record<string, React.ReactNode> = {
      Checkbox: (
        <FormField
          {...commonProps}
          render={({ field: formField }) => (
            <FormItem className={cn(
              "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4",
              field.className,
            )}>
              <FormControl>
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => {
                    setChecked(!checked)
                    formField.onChange(!checked)
                  }}
                  disabled={field.disabled}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{field.label}</FormLabel>
                <FormDescription>{field.description}</FormDescription>
              </div>
            </FormItem>
          )}
        />
      ),

      Combobox: (
        <FormField
          {...commonProps}
          render={({ field: formField }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{field.label}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !fieldValue && "text-muted-foreground"
                      )}
                    >
                      {fieldValue
                        ? languages.find((language) => language.value === fieldValue)?.label
                        : "Select language"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandList>
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {languages.map((language) => (
                          <CommandItem
                            value={language.label}
                            key={language.value}
                            onSelect={() => {
                              setFieldValue(language.value)
                              formField.onChange(language.value)
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                language.value === fieldValue ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {language.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>{field.description}</FormDescription>
            </FormItem>
          )}
        />
      ),

      "Date Picker": (
        <FormField
          {...commonProps}
          render={({ field: formField }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{field.label}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !formField.value && "text-muted-foreground"
                      )}
                    >
                      {formField.value ? (
                        format(formField.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formField.value}
                    onSelect={formField.onChange}
                    disabled={field.disabled}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>{field.description}</FormDescription>
            </FormItem>
          )}
        />
      ),

      "File Input": (
        <FormField
          {...commonProps}
          render={() => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <FileUploader
                  value={files}
                  onValueChange={setFiles}
                  dropzoneOptions={{
                    maxFiles: 5,
                    maxSize: 1024 * 1024 * 4,
                    multiple: true,
                  }}
                  className="relative bg-background rounded-lg p-2"
                >
                  <FileInput
                    id="fileInput"
                    className="outline-dashed outline-1 outline-slate-500"
                  >
                    <FileSvgDraw />
                  </FileInput>
                  <FileUploaderContent>
                    {files?.map((file, i) => (
                      <FileUploaderItem key={i} index={i}>
                        <Paperclip className="h-4 w-4 stroke-current" />
                        <span>{file.name}</span>
                      </FileUploaderItem>
                    ))}
                  </FileUploaderContent>
                </FileUploader>
              </FormControl>
              <FormDescription>{field.description}</FormDescription>
            </FormItem>
          )}
        />
      ),

      Input: (
        <FormField
          {...commonProps}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <Input
                  {...formField}
                  type={field.type}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                />
              </FormControl>
              <FormDescription>{field.description}</FormDescription>
            </FormItem>
          )}
        />
      ),

      "Input OTP": (
        <FormField
          {...commonProps}
          render={() => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <InputOTP maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>{field.description}</FormDescription>
            </FormItem>
          )}
        />
      ),

      "Location Input": (
        <FormField
          {...commonProps}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <LocationSelector
                  onCountryChange={(country) => {
                    setCountryName(country?.name || "")
                    formField.onChange([country?.name || "", stateName || ""])
                  }}
                  onStateChange={(state) => {
                    setStateName(state?.name || "")
                    formField.onChange([countryName || "", state?.name || ""])
                  }}
                />
              </FormControl>
              <FormDescription>{field.description}</FormDescription>
            </FormItem>
          )}
        />
      ),

      "Multi Select": (
        <FormField
          {...commonProps}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <MultiSelector
                  values={selectedValues}
                  onValuesChange={(newValues) => {
                    setSelectedValues(newValues)
                    formField.onChange(newValues)
                  }}
                  className="max-w-xs"
                >
                  <MultiSelectorTrigger>
                    <MultiSelectorInput placeholder="Select options" />
                  </MultiSelectorTrigger>
                  <MultiSelectorContent>
                    <MultiSelectorList>
                      <MultiSelectorItem value="React">React</MultiSelectorItem>
                      <MultiSelectorItem value="Vue">Vue</MultiSelectorItem>
                      <MultiSelectorItem value="Svelte">Svelte</MultiSelectorItem>
                    </MultiSelectorList>
                  </MultiSelectorContent>
                </MultiSelector>
              </FormControl>
              <FormDescription>{field.description}</FormDescription>
            </FormItem>
          )}
        />
      ),

      "Password": (
        <FormField
          {...commonProps}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <PasswordInput
                  {...formField}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                />
              </FormControl>
              <FormDescription>{field.description}</FormDescription>
            </FormItem>
          )}
        />
      ),

      "Phone": (
        <FormField
          {...commonProps}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <PhoneInput
                  defaultCountry="US"
                  onChange={(phoneNumber) => {
                    formField.onChange(phoneNumber)
                  }}
                  disabled={field.disabled}
                />
              </FormControl>
              <FormDescription>{field.description}</FormDescription>
            </FormItem>
          )}
        />
      ),

      "Select": (
        <FormField
          {...commonProps}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <Select onValueChange={formField.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>{field.description}</FormDescription>
            </FormItem>
          )}
        />
      ),

      "Signature Input": (
        <FormField
          {...commonProps}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <SignatureInput
                  canvasRef={canvasRef}
                  onSignatureChange={(signature) => {
                    if (signature) formField.onChange(signature)
                  }}
                />
              </FormControl>
              <FormDescription>{field.description}</FormDescription>
            </FormItem>
          )}
        />
      ),

      "Slider": (
        <FormField
          {...commonProps}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <Slider
                  min={field.min || 0}
                  max={field.max || 100}
                  step={field.step || 1}
                  defaultValue={[field.value ? parseInt(field.value) : 0]}
                  onValueChange={(value) => formField.onChange(value[0])}
                  disabled={field.disabled}
                />
              </FormControl>
              <FormDescription>
                {field.description}
                {formField.value !== undefined && ` Selected value is ${formField.value}`}
              </FormDescription>
            </FormItem>
          )}
        />
      ),

      "Smart Datetime Input": (
        <FormField
          {...commonProps}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <SmartDatetimeInput
                  locale={field.locale}
                  hour12={field.hour12}
                  value={formField.value}
                  onValueChange={formField.onChange}
                  placeholder="e.g. tomorrow at 3pm"
                  disabled={field.disabled}
                />
              </FormControl>
              <FormDescription>{field.description}</FormDescription>
            </FormItem>
          )}
        />
      ),

      "Switch": (
        <FormField
          {...commonProps}
          render={({ field: formField }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>{field.label}</FormLabel>
                <FormDescription>{field.description}</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={checked}
                  onCheckedChange={() => {
                    setChecked(!checked)
                    formField.onChange(!checked)
                  }}
                  disabled={field.disabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
      ),

      "Tags Input": (
        <FormField
          {...commonProps}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <TagsInput
                  value={tagsValue}
                  onValueChange={(newTags) => {
                    setTagsValue(newTags)
                    formField.onChange(newTags)
                  }}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                />
              </FormControl>
              <FormDescription>{field.description}</FormDescription>
            </FormItem>
          )}
        />
      ),

      "Textarea": (
        <FormField
          {...commonProps}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <Textarea
                  {...formField}
                  placeholder={field.placeholder}
                  className="resize-none min-h-[100px]"
                  disabled={field.disabled}
                />
              </FormControl>
              <FormDescription>{field.description}</FormDescription>
            </FormItem>
          )}
        />
      ),
    }

    return renderMap[field.variant] || (
      <FormField
        {...commonProps}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>{field.label}</FormLabel>
            <FormControl>
              <Input
                {...formField}
                placeholder={field.placeholder}
                disabled={field.disabled}
              />
            </FormControl>
            <FormDescription>{field.description}</FormDescription>
          </FormItem>
        )}
      />
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {fields.sort((a, b) => a.rowIndex - b.rowIndex).map(renderFormField)}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default DynamicForm