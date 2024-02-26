import '../App.css'
import { Header } from '../components/Header'
import { Footer } from '@/components/Footer'
import { PromptForm } from '../components/PromptForm'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function NewPrompt() {
    const navigate = useNavigate();

    return (
        <>
            <Header></Header>
            <div className="body-content flex flex-col md:flex-row">
                <button onClick={() => navigate(-1)} className="flex md:pb-7 mt-10 cursor-pointer h-min w-min">
                    <ArrowLeft width="40" height="40"></ArrowLeft>
                </button>
                <div className="flex flex-col items-center w-full">
                    <div className="text-3xl text-plum-900 mt-7">Create a new prompt!</div>
                    <PromptForm></PromptForm>
                </div>
            </div>
            
            <Footer></Footer>
        </>
    )
}