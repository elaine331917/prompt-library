import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { Link, useNavigate } from "react-router-dom";

const MAX_CHARACTERS = 200;
  
export function PromptData() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleted, setDeleted] = useState(false);

    const truncateContent = (content: string) => {
        if (content.length > MAX_CHARACTERS) {
          return content.substring(0, MAX_CHARACTERS) + "...";
        }
        return content;
    };

    useEffect(() => {
        fetchData();
    }, []);
    
    useEffect(() => {
        fetchData();
        setDeleted(false)
    }, [deleted]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${location.origin}/api/prompts`);
            if (!response.ok) {
                throw new Error("Network response not ok");
            }
            const data = await response.json();
            data.sort((a, b) => a.created < b.created ? -1 : a.created > b.created ? 1 : 0)
            setData(data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError('An error occurred while fetching data: ' + error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${location.origin}/api/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id
                }),
            })
        } catch (error) {
            console.error('Error:', error);
        } finally {
            toast({
                description: "Prompt deleted.",
            })
            setDeleted(true)
        }
    }

    return (
      <Table className="text-left">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Prompt</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Example Output</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Votes</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
            { loading && <div className="loading-circle"></div>}
            { error && <div>Error: {error}</div>}
            { data && data.map((prompt) => (
                <TableRow key={prompt.prompt}>
                <TableCell className="underline decoration-plum-700">
                    <Link to={`/prompts/${prompt.id}`}>{prompt.header}</Link>
                </TableCell>
                <TableCell>{prompt.category}</TableCell>
                <TableCell>{truncateContent(prompt.content)}</TableCell>
                <TableCell>{prompt.tags.join(', ')}</TableCell>
                <TableCell>{truncateContent(prompt.example)}</TableCell>
                <TableCell>{prompt.usage}</TableCell>
                <TableCell>{prompt.votes}</TableCell>
                <TableCell>{new Date(prompt.created).toLocaleString()}</TableCell>
                <TableCell>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="bg-grapefruit-700 hover:bg-grapefruit-600">Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently this prompt from our database.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className="bg-grapefruit-700 hover:bg-grapefruit-600" onClick={() => handleDelete(prompt.id)}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </TableCell>
                </TableRow>
            ))}
        </TableBody>
      </Table>
    )
}
  