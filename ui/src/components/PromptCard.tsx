import { useState } from 'react'
import '../App.css'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Link } from 'react-router-dom'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { DownButton } from '@/assets/DownButton'
import { UpButton } from '@/assets/UpButton'

const MAX_CHARACTERS: number = 100;

export interface Prompt {
    id: string;
    header: string;
    content: string;
    category: string;
    example: string;
    created: string;
    votes: number;
    tags: String[];
    usage: number;
}

export interface PromptCardProps {
    prompt: Prompt;
}

const truncateContent = (content: string) => {
  if (content.length > MAX_CHARACTERS) {
    return content.substring(0, MAX_CHARACTERS) + "...";
  }
  return content;
};

export function PromptCard({ prompt }: PromptCardProps) {
    const [votes, setVotes] = useState(prompt.votes);
    const [isPending, setIsPending] = useState(false);
    const { toast } = useToast()
    
    const handleVote = async (up: Boolean) => { 
        setIsPending(true);
        const newVotes = up ? votes + 1 : votes - 1;
  
        fetch(`${location.origin}/api/prompts/${prompt.id}/edit/vote`, {
          method: 'PUT',
          body: JSON.stringify({
            votes: newVotes
          }),
          headers: { 'Content-Type': 'application/json' },
        }).then(() => {
            setVotes(newVotes);
            prompt.votes = newVotes
            setIsPending(false);
        }).catch((error) => {
            console.error('Error:', error);
            setIsPending(false);
        }).finally(() => {
            const message = up ? "Successfully upvoted!" : "Successfully downvoted."
            toast({
              description: message,
            })
        });
    }
  
    return (
      <>
        <Card className="inline-flex flex-col custom-card rounded-xl border-plum-700 bg-white w-80 justify-between">
          <div className="flex flex-col gap-2 w-full">
            <CardHeader className="flex flex-row justify-between p-0 items-center custom-card-header w-full">
              <Badge className="bg-plum-100 hover:bg-plum-100 text-blueberry-500 px-3 py-2 rounded-lg text-sm mb-1">{prompt.category}</Badge>
            </CardHeader>
            <CardContent className="flex flex-col custom-card-content w-full text-left">
              <CardTitle>{prompt.header}</CardTitle>
              <CardDescription className="flex text-left text-base text-black">{truncateContent(prompt.content)}</CardDescription>
            </CardContent>
          </div>
          <CardFooter className="flex flex-col p-0 custom-card-footer gap-2 items-center justify-between w-full">
            <div className="flex flex-row items-center justify-between w-full">
              <div className="flex text-left text-sm text-slate-500">
                Used {prompt.usage} times
              </div>
              <div className="flex flex-row items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => handleVote(true)}>
                  <UpButton></UpButton>
                </Button>
                { !isPending && <div className="px-2 text-plum-700">{prompt.votes}</div>}
                { isPending && <div className="loading-circle-small"></div>}
                
                <Button variant="ghost" size="icon" onClick={() => handleVote(false)}>
                  <DownButton></DownButton>
                </Button>
              </div>
            </div>
            <Link to={`/prompts/${prompt.id}`} className="w-full"><Button className="w-full bg-plum-800 hover:bg-plum-600">View Prompt</Button></Link>
          </CardFooter>
        </Card>
        <Toaster></Toaster>
      </>
    )
}

export default PromptCard
