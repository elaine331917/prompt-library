import '../App.css'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const categories = [
  { label: "Coding", value: "Coding" },
  { label: "Education", value: "Education" },
  { label: "Creative", value: "Creative" },
  { label: "Business", value: "Business" },
  { label: "Logistics", value: "Logistics" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Other", value: "Other" },
] as const

const formSchema = z.object({
  header: z.string().min(1, {
    message: "Please enter a descriptive title for your prompt.",
  }).max(40, {
    message: "Maximum 40 characters."
  }),
  content: z.string().min(1, {
    message: "Please enter a prompt.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }).min(1, {
    message: "Please select a category.",
  }),
  tags: z.string(),
  example: z.string(),

})

export function PromptForm() {
  const [showForm, setShowForm] = useState(true);
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      header: "",
      content: "",
      category: "",
      tags: "",
      example: "",
    },
  })

  const [createdPromptId, setCreatedPromptId] = useState(null);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    const tagsArray = values.tags.split(',').map((tag) => tag.trim().toLowerCase());
    try {
        const response = await fetch(`${location.origin}/api/prompts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({...values, tags: tagsArray}),
        });
  
        if (!response.ok) {
          throw new Error('Failed to create prompt');
        }
        // get new prompt id
        if (response.status === 201) {
          await response.json().then((data) => {
            console.log(data)
            const newPromptId = data.id;
            setCreatedPromptId(newPromptId);
          })
        }
        console.log(createdPromptId)
      } catch (error) {
        console.error('Error creating prompt:', error);
        setFeedback('An error occurred while creating the prompt');
      } finally {
        toast({
          description: "Prompt submitted!",
        })
      }
    setShowForm(false);
  }

  const navigate = useNavigate();

  useEffect(() => {
    if (createdPromptId) {
      navigate(`/prompts/${createdPromptId}`)
    }
  }, [createdPromptId]);

  return (
    <div className="create-prompt flex flex-col w-4/5 lg:w-1/2">
        {showForm ? (
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col justify-start items-center py-8">
                <div className="flex flex-col gap-y-5 w-full">
                  <FormField
                  control={form.control}
                  name="header"
                  render={({ field }) => (
                      <FormItem className="form-input">
                      <FormLabel>Header</FormLabel>
                      <FormControl>
                          <Input placeholder="Short descriptor of the prompt" {...field} className="w-full"/>
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                      <FormItem className="form-input">
                      <FormLabel>Prompt</FormLabel>
                      <FormControl>
                          <Textarea
                              placeholder="Provide the full prompt here"
                              className="resize"
                              {...field}
                          />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                      <FormItem className="form-input">
                      <FormLabel>Category</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[200px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? categories.find(
                                    (category) => category.value === field.value
                                  )?.label
                                : "Select category"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search category..." />
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {categories.map((category) => (
                                <CommandItem
                                  value={category.label}
                                  key={category.value}
                                  onSelect={() => {
                                    form.setValue("category", category.value)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      category.value === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {category.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name="tags"
                  render={({ field }) => (
                      <FormItem className="form-input">
                      <FormLabel>Tags</FormLabel>
                      <FormControl>
                          <Input
                              placeholder="Provide potential use cases"
                              className="resize"
                              {...field}
                          />
                      </FormControl>
                      <FormDescription>
                        If more than one use case, separate them with commas.
                      </FormDescription>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                  control={form.control}
                  name="example"
                  render={({ field }) => (
                      <FormItem className="form-input">
                      <FormLabel>Example</FormLabel>
                      <FormControl>
                      <Textarea
                              placeholder="Optionally, provide an example output from an LLM"
                              className="resize"
                              {...field}
                          />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                </div>
                <Button type="submit" className="bg-grapefruit-800 hover:bg-grapefruit-700">Submit</Button>
            </form>
            </Form>
        ): feedback}
        <Toaster></Toaster>
    </div>
  )
}
