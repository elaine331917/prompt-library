import '../App.css'
import { Header } from '../components/Header'
import { Footer } from '@/components/Footer'

export function NotFound() {
    return (
        <>
            <Header></Header>
            <div className="not-found body-content flex flex-col justify-center items-center">
                <div className="text-4xl text-plum-700">Uh oh... We can't find this page.</div>
                <div className="text-xl py-7">No worries — we can still get you where you need to go.</div>
            </div>
            <Footer></Footer>
        </>
    )
}