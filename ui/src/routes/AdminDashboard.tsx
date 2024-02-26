import '../App.css'
import { Header } from '../components/Header'
import { Footer } from '@/components/Footer'
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { PromptData } from '@/components/PromptData';

export function AdminDashboard() {
    // Verify authentication
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const userRole = localStorage.getItem('token');
        setIsAdmin(userRole === 'admin');
    }, []);

    // Log out button
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <>
            <Header></Header>
            <div className="body-content">
                <div>
                    {isAdmin ? (
                        <div className="flex flex-col items-start">
                            <div className="flex flex-row justify-between w-full p-5">
                                <div className="text-2xl text-plum-800 font-semibold">Admin Dashboard</div>
                                <Button className="bg-plum-800 hover:bg-plum-700" onClick={handleLogout}>Logout</Button>
                            </div>
                            <div>
                                <PromptData></PromptData>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center">
                            <h2>Whoops, you don't have permission for that.</h2>
                            <Link to='/'>Click here to go back to the homepage.</Link>
                        </div>
                    )}
                </div>
            </div>
            <Footer></Footer>
        </>
    )
}