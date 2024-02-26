import '../App.css'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Header } from '../components/Header'
import { Footer } from '@/components/Footer'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
    sub: string;
    role: string;
}

export function Login() {
    const navigate = useNavigate();

    const formSchema = z.object({
        username: z.string().min(1).max(50),
        password: z.string().min(1).max(50),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
          password: ""
        },
    })
    
    async function onSubmit(values: z.infer<typeof formSchema>) {

        const username = values.username
        const password = values.password

        try {
            const response = await fetch(`${location.origin}/api/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ username, password }),
            });
      
            if (!response.ok) {
              throw new Error('Invalid credentials');
            }
      
            const { token } = await response.json();

            const decoded: JwtPayload = jwtDecode(token);

            localStorage.setItem('token', decoded.role);

            navigate(`/admin`)
    
          } catch (error) {
            console.error('Login failed:', error);
          }
    }

    return (
        <>
            <Header></Header>

            <div className="body-content flex flex-col md:flex-row items-center justify-center">
                <Card className="text-left md:w-96 w-full">
                    <CardHeader className="text-lg font-semibold text-plum-800">Login</CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Username" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                                <Button className="bg-plum-700 hover:bg-plum-600" type="submit">Login</Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
            
            <Footer></Footer>
        </>
    )
}