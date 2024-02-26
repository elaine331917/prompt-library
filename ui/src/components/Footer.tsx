import '../App.css'
import { Link } from "react-router-dom";

export function Footer() {
    return (
        <div className="custom-footer flex flex-row justify-between items-center h-20 px-5 md:px-20 mt-5">
            <p>©2009–2023 Ally Financial Inc.</p>
            <div className="flex flex-row items-center gap-x-8">
                <Link to={'https://forms.gle/Lzz2trx5LHm3U9qW9'} target="_blank" rel="noopener noreferrer">Feedback</Link>
                <Link to={'https://www.ally.com/legal/'} target="_blank" rel="noopener noreferrer">Legal</Link>
            </div>
        </div>
    )
}