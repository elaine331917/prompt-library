import { useEffect, useState } from 'react'
import '../App.css'
import { Prompt, PromptCard } from '@/components/PromptCard'
import { Header } from '@/components/Header'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { Footer } from '@/components/Footer'
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

function SortDropdown({ onFilterSelect }) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    const frameworks = [
        {
          value: "recent",
          label: "Recent",
        },
        {
          value: "votes",
          label: "Votes",
        },
        {
          value: "usage",
          label: "Usage",
        },
    ]

    return (
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
            >
            {value
                ? frameworks.find((framework) => framework.value === value)?.label
                : "Select filter..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
            <Command>
            <CommandGroup>
                {frameworks.map((framework) => (
                <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                        if (currentValue !== value) {
                            setValue(currentValue);
                            onFilterSelect(currentValue);
                        } else {
                            setValue('');
                            onFilterSelect('');
                        }
                        setOpen(false);
                    }}
                >
                    <Check
                    className={cn(
                        "mr-2 h-4 w-4",
                        value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                    />
                    {framework.label}
                </CommandItem>
                ))}
            </CommandGroup>
            </Command>
        </PopoverContent>
        </Popover>
    )
}
   
function CategoryDropdown({ onCategorySelect }) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    const [categories, setCategories] = useState(null);
    const [frameworks, setFrameworks] = useState([
        {
          value: 'temp',
          label: 'temp',
        },
    ]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
        const response = await fetch(`${location.origin}/api/categories`);
        if (!response.ok) {
            throw new Error("Network response not ok");
        }
        const data = await response.json();
        setCategories(data.categories);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        if (categories) {
            const mappedFrameworks = categories.map((category) => ({
                value: category,
                label: category,
            }));
            setFrameworks(mappedFrameworks);
        }
    }, [categories]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
            >
            {value ? value : 'Select category...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
            <Command>
            <CommandInput placeholder="Search categories..." />
            <CommandEmpty>No categories found.</CommandEmpty>
            <CommandGroup>
                {frameworks.map((framework) => (
                <CommandItem className="text-left"
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                        if (currentValue !== value) {
                            setValue(currentValue);
                            onCategorySelect(framework.label);
                        } else {
                            setValue('');
                            onCategorySelect('');
                        }
                        setOpen(false);
                    }}
                >
                    <Check
                    className={cn(
                        "mr-2 h-4 w-4",
                        value === framework.label.toLowerCase() ? "opacity-100" : "opacity-0"
                    )}
                    />
                    {framework.label}
                </CommandItem>
                ))}
            </CommandGroup>
            </Command>
        </PopoverContent>
        </Popover>
    )
}

function TagsDropdown({ onTagSelect }) {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    const [tags, setTags] = useState(null);
    const [frameworks, setFrameworks] = useState([
        {
          value: 'temp',
          label: 'temp',
        },
    ]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
        const response = await fetch(`${location.origin}/api/tags`);
        if (!response.ok) {
            throw new Error("Network response not ok");
        }
        const data = await response.json();
        setTags(data.tags);
        console.log(data)
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        if (tags) {
            const mappedFrameworks = tags.map((tag) => ({
                value: tag,
                label: tag,
            }));
            setFrameworks(mappedFrameworks);
        }
    }, [tags]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
            >
            {value ? value : 'Select tag...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
            <Command>
            <CommandInput placeholder="Search tags..." />
            <CommandEmpty>No tags found.</CommandEmpty>
            <CommandGroup>
                {frameworks.map((framework) => (
                <CommandItem className="text-left"
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                        if (currentValue !== value) {
                            setValue(currentValue);
                            onTagSelect(framework.label);
                        } else {
                            setValue('');
                            onTagSelect('');
                        }
                        setOpen(false);
                    }}
                >
                    <Check
                    className={cn(
                        "mr-2 h-4 w-4",
                        value === framework.label.toLowerCase() ? "opacity-100" : "opacity-0"
                    )}
                    />
                    {framework.label}
                </CommandItem>
                ))}
            </CommandGroup>
            </Command>
        </PopoverContent>
        </Popover>
    )
}


interface GridProps {
  prompts: Prompt[]
  filter?: String
  tag?: String
}

function Grid({ prompts, filter, tag }: GridProps) {

    let sortedPrompts = prompts

    switch(filter) { 
        case "votes": { 
            sortedPrompts = prompts.sort((a, b) => b.votes - a.votes)
            break; 
        } 
        case "recent": { 
            sortedPrompts = prompts.sort((a, b) => b.created.localeCompare(a.created))
            break; 
        } 
        case "usage": { 
            sortedPrompts = prompts.sort((a, b) => b.usage - a.usage)
            break; 
        } 
        default: { 
            sortedPrompts = prompts
            break; 
        } 
    }

    if (tag) {
        sortedPrompts = sortedPrompts.filter(prompt => prompt.tags && prompt.tags.includes(tag));
    }

    return (
        <div className="flex flex-wrap gap-1 justify-start">
        {sortedPrompts.map((prompt, index) => (
            <PromptCard
            key={`prompt-${index}`}
            prompt={{ ...prompt }}
            />
        ))}
        </div>
    );
}

export function BrowsePrompts() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  useEffect(() => {
    fetchData(selectedCategory);
  }, [selectedCategory]);

  const fetchData = async (category) => {
    setLoading(true);
    setError(null);
    try {
      let url = `${location.origin}/api/prompts`;
      if (category) {
        url += `/categories/${category}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Network response not ok");
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        setError('An error occurred while fetching data: ' + error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="">
      <Header></Header>
      <div className="body-content flex flex-col md:flex-row gap-5 items w-full">
        <div className="options flex flex-row items-start gap-3 md:flex-col md:mt-20 flex-wrap mt-8 min-w-fit">
            <div>Sort by</div>
            <SortDropdown onFilterSelect={setSelectedFilter}></SortDropdown>
            <div>Filter by Category</div>
            <CategoryDropdown onCategorySelect={setSelectedCategory}></CategoryDropdown>
            <div>Filter by Use Case</div>
            <TagsDropdown onTagSelect={setSelectedTag}></TagsDropdown>
            <div>Have a new idea?</div>
            <Link to="/prompts/new">
                <Button className="min-w-fit bg-grapefruit-800 hover:bg-grapefruit-700">Create Prompt</Button>
            </Link>
        </div>
        <div className="flex flex-col items-start">
            <h1 className="text-4xl pt-5">Browse Prompts</h1>
            { loading && <div className="loading-circle"></div>}
            { error && <div>Error: {error}</div>}
            <br></br>
            { data && <Grid prompts={data} filter={selectedFilter} tag={selectedTag}></Grid>}
        </div>
      </div>
      <Footer></Footer>
    </div>
  )
}
