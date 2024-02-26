import { Logo } from '@/assets/Logo';
import '../App.css'
import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button';

export function Header() {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <div className="custom-header flex flex-row justify-between items-center md:px-20">
            <Link to={'/'}>
                <div className="logo flex flex-row items-center gap-x-3">
                    <Logo></Logo>
                    <div className="title font-bold text-2xl text-grapefruit-600">Prompt Library</div>
                </div>
            </Link>
            <div className="nav flex flex-row items-center gap-x-8 mr-5">
                <Link to="/">Home</Link>
                <Link to="/prompts">Browse</Link>
                {isAuthenticated ? (
                    <Link to="/admin">Dashboard</Link>
                ) : (
                    <Link to="/login">
                        <Button className="bg-plum-800 hover:bg-plum-700">Login</Button>
                    </Link>
                    
                )}
            </div>
        </div>
    )
}

export default Header