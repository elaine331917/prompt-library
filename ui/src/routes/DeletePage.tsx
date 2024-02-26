import '../App.css'
import { Header } from '../components/Header'
import { Footer } from '@/components/Footer'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
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

export function DeletePage() {
    // Get id from route
    const {id} = useParams()
    const { toast } = useToast()

    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setError(null);
        try {
            const response = await fetch(`${location.origin}/api/delete/${id}`);
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

    useEffect (() => {
        fetchData();
    }, [id]);

    const handleDelete = async () => {
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
            navigate(`/prompts`)
        }
    }

    return (
        <>
            <Header></Header>
            <div className="body-content flex flex-col justify-center items-center w-full">
                {loading ? (
                    <div className="loading-circle"></div>
                ) : error ? (
                    <div>{error}</div>
                ) : data ? (
                    <div className="prompt-page-container flex flex-col items-center justify-center gap-y-6 w-full mt-4">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button>Delete Prompt</Button>
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
                                <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <div className="flex flex-row justify-between items-center gap-x-5 w-full">
                            <Badge className="bg-plum-100 hover:bg-plum-100 text-plum-600 px-3 py-2 rounded-lg text-sm">{data.category}</Badge>
                            <div className="text-sm text-gray-500">{new Date(data.created).toLocaleString()}</div>
                        </div>
                        <div className="font-medium text-3xl">{data.header}</div>
                        <div className="text-left w-full font-medium text-2xl">Prompt</div>
                        <div className="p-5 bg-gray-100 rounded-xl w-full text-left flex flex-col gap-5">
                            {data.content}
                        </div>
                        <div className="text-left w-full font-medium text-xl">Example Output</div>
                        <div className="p-5 bg-gray-100 rounded-xl w-full text-left">{data.example}</div>
                        <div className="flex flex-col items-center justify-center gap-y-4">
                            <div className="text-sm text-gray-500">Used {data.usage} times</div>
                            <div className="text-sm text-gray-500">Upvotes/downvotes: {data.votes}</div>
                        </div>
                    </div>
                ) : (
                    <></>
                )}
            </div>
            <Footer></Footer>
            <Toaster />
        </>
    )
}