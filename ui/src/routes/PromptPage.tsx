import '../App.css'
import { Header } from '../components/Header'
import { Footer } from '@/components/Footer'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { UpButton } from '@/assets/UpButton'
import { DownButton } from '@/assets/DownButton'
import { ArrowLeft } from 'lucide-react'

export function PromptPage() {
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
            const response = await fetch(`${location.origin}/api/prompts/${id}`);
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

    useEffect (() => {
        if (data) {
            setTextToCopy(data.content)
            setVotes(data.votes)
            setUsage(data.usage)
        }
    }, [data])


    // Handle upvoting and downvoting
    const [usage, setUsage] = useState(null);
    const [votes, setVotes] = useState(null);
    const [isPending, setIsPending] = useState(false);
    
    const handleVote = async (up: Boolean) => { 
        setIsPending(true);
        const newVotes = up ? votes + 1 : votes - 1;
        setVotes(newVotes);
  
        try {
            await fetch(`${location.origin}/api/prompts/${id}/edit/vote`, {
                method: 'PUT',
                body: JSON.stringify({
                    votes: newVotes
                }),
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            console.error('Error:', error);
            setVotes(votes);
        } finally {
            setIsPending(false);
            const message = up ? "Successfully upvoted!" : "Successfully downvoted."
            toast({
                description: message,
            })
        }
    }

    // Copy prompt text
    const [textToCopy, setTextToCopy] = useState(data ? data.content : "Error");

    const handleCopyClick = async () => {
        navigator?.clipboard?.writeText(textToCopy)
        .then(async () => {
            toast({
                description: "Copied to clipboard.",
            })
            const newUsage = usage + 1
            setUsage(newUsage)
            console.log(usage, newUsage)

            try {
                await fetch(`${location.origin}/api/prompts/${id}/edit/usage`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        usage: newUsage
                    }),
                    headers: { 'Content-Type': 'application/json' },
                });
            } catch (error) {
                console.error('Error:', error);
                setUsage(usage);
            }
        })
        .catch((error) => {
            toast({
                description: "Oops, failed to copy.",
            })
            console.error('Failed to copy text: ', error);
        });
    };

    return (
        <>
            <Header></Header>
            <div className="body-content">
                {loading ? (
                    <div className="loading-circle"></div>
                ) : error ? (
                    <div>{error}</div>
                ) : data ? (
                    <div className="flex gap-x-28 p-8 w-full flex-wrap">
                        <button onClick={() => navigate(-1)} className="flex pb-7 cursor-pointer h-min">
                            <ArrowLeft width="40" height="40"></ArrowLeft>
                        </button>
                        <div className="prompt-page-container flex flex-col items-center justify-center gap-y-6">
                            <div className="flex flex-row justify-between items-center gap-x-5 w-full">
                                <Badge className="bg-plum-100 hover:bg-plum-100 text-plum-600 px-3 py-2 rounded-lg text-sm">{data.category}</Badge>
                                <div className="text-sm text-gray-500">{new Date(data.created).toLocaleString()}</div>
                            </div>
                            <div className="font-medium text-3xl">{data.header}</div>
                            <div className="prompt-section">
                                <div className="text-left w-full font-medium text-2xl">Prompt</div>
                                <div className="p-5 bg-gray-100 rounded-xl w-full text-left flex flex-col gap-5">
                                    {data.content}
                                    <Button className="w-min bg-grapefruit-800 hover:bg-grapefruit-700" onClick={handleCopyClick}>
                                        Copy
                                    </Button>
                                </div>
                            </div>
                            <div className="prompt-section">
                                <div className="text-left w-full font-medium text-xl">Use Cases</div>
                                <div className="tags flex flex-row flex-wrap gap-2 w-full justify-start">
                                    {data.tags?.map((tag, index) => (
                                        <div className="tag bg-black text-white rounded px-2 py-1"key={index}>{tag}</div>
                                    ))}
                                </div>
                            </div>
                            <div className="prompt-section">
                                <div className="text-left w-full font-medium text-xl">Example Output</div>
                                <div className="p-5 bg-gray-100 rounded-xl w-full text-left">
                                    {data.example.split('\n').map((paragraph, index) => (
                                        <p key={index} className="py-1">{paragraph}</p>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center gap-y-4">
                                <div className="text-sm text-gray-500">Used {usage} times</div>
                                <div className="text-lg">Was this prompt helpful?</div>
                                <div className="flex flex-row items-center justify-between">
                                    <Button variant="ghost" size="icon" onClick={() => handleVote(true)}>
                                        <UpButton></UpButton>
                                    </Button>
                                    { !isPending && <div className="px-2 text-plum-700">{votes}</div>}
                                    { isPending && <div className="loading-circle-small"></div>}
                                    
                                    <Button variant="ghost" size="icon" onClick={() => handleVote(false)}>
                                        <DownButton></DownButton>
                                    </Button>
                                </div>
                            </div>
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
