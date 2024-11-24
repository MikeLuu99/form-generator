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
// import { DatetimePicker } from "@/components/ui/date-picker"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, Calendar as CalendarIcon, CloudUpload, Paperclip } from "lucide-react"
// import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/components/ui/file-upload"
// import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
// import LocationSelector from "@/components/ui/location-input"
// import { MultiSelector, MultiSelectorContent, MultiSelectorInput, MultiSelectorItem, MultiSelectorList, MultiSelectorTrigger } from "@/components/ui/multi-select"
// import { PasswordInput } from "@/components/ui/password-input"
// import { PhoneInput } from "@/components/ui/phone-input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import SignatureInput from "@/components/ui/signature-input"
// import { Slider } from "@/components/ui/slider"
// import { SmartDatetimeInput } from "@/components/ui/smart-datetime-input"
// import { Switch } from "@/components/ui/switch"
// import { TagsInput } from "@/components/ui/tags-input"
import { Textarea } from "@/components/ui/textarea"

// Types
// biome-ignore lint/suspicious/noRedeclare: <explanation>
interface FormField {
  checked: boolean
  description: string
  disabled: boolean
  label: string
  name: string
  placeholder: string
  required: boolean
  rowIndex: number
  type: string
  value: string
  variant: string
}

interface DynamicFormProps {
  fields: FormField[]
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  onSubmit: (data: any) => void
}

const generateZodSchema = (fields: FormField[]) => {
  const schemaMap: Record<string, any> = {};
  
  // biome-ignore lint/complexity/noForEach: <explanation>
    fields.forEach((field) => {
    switch (field.variant) {
      case "Checkbox":
      case "Switch":
        schemaMap[field.name] = z.boolean().default(field.checked);
        break;
      case "Date Picker":
      case "Datetime Picker":
      case "Smart Datetime Input":
        schemaMap[field.name] = z.coerce.date();
        break;
      case "Location Input":
        schemaMap[field.name] = z.tuple([z.string(), z.string().optional()]);
        break;
      case "Multi Select":
      case "Tags Input":
        schemaMap[field.name] = z.array(z.string()).nonempty("Please select at least one item");
        break;
      case "Slider":
        schemaMap[field.name] = z.number();
        break;
      default:
        schemaMap[field.name] = z.string();
    }
  });

  return z.object(schemaMap);
};

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, onSubmit }) => {
  const [files, setFiles] = useState<File[] | null>(null);
  const [countryName, setCountryName] = useState("");
  const [stateName, setStateName] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const formSchema = generateZodSchema(fields);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const renderFormField = (field: FormField) => {
    const commonProps = {
      control: form.control,
      name: field.name,
      key: field.name,
    };

    const renderMap: Record<string, React.ReactNode> = {
      Checkbox: (
        <FormField
          {...commonProps}
          render={({ field: formField }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={formField.value}
                  onCheckedChange={formField.onChange}
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
                      disabled={field.disabled}
                      className={cn(
                        "w-full justify-between",
                        !formField.value && "text-muted-foreground"
                      )}
                    >
                      {formField.value || "Select option"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder={field.placeholder} />
                    <CommandList>
                      <CommandEmpty>No options found.</CommandEmpty>
                      <CommandGroup>
                        {/* Add your options here */}
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
                      disabled={field.disabled}
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

      "Input": (
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
      Textarea: (
        <FormField
          {...commonProps}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>{field.label}</FormLabel>
              <FormControl>
                <Textarea
                  {...formField}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                  className="resize-none min-h-[100px]"
                />
              </FormControl>
              <FormDescription>{field.description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      ),

      // Add other variants here...
    };

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
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {fields.sort((a, b) => a.rowIndex - b.rowIndex).map(renderFormField)}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default DynamicForm;