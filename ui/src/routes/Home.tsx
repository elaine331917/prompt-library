import { useEffect, useRef, useState } from 'react'
import '../App.css'
import { Prompt, PromptCard } from '@/components/PromptCard'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Typewriter from '@/components/Typewriter'

interface GridProps {
  prompts: Prompt[]
}

function Grid({ prompts }: GridProps) {
  return (
    <div className="flex flex-wrap gap-1 justify-center">
      {prompts.map((prompt, index) => (
        <PromptCard
        key={`prompt-${index}`}
        prompt={{ ...prompt }}
        />
      ))}
    </div>
  );
}

export function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const ref = useRef(null);

  const handleScroll = () => {
    ref.current?.scrollIntoView({behavior: 'smooth'});
  }

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${location.origin}/api/prompts`);
      if (!response.ok) {
        throw new Error("Network response not ok");
      }
      const data = await response.json();
      // limit to 8 most popular prompts
      data.sort((a, b) => a.votes > b.votes ? -1 : a.votes < b.votes ? 1 : 0);
      setData(data.slice(0,8));
    } catch (error) {
      console.error("Error fetching data:", error);
      setError('An error occurred while fetching data: ' + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <Header></Header>
      <div className="banner bg-blueberry-800 flex flex-col items-center justify-between">
        <div className="flex flex-row items-center justify-between w-full px-20 py-20 mt-24 md:mt-12 gap-5">
          <div className="tagline text-left">
            <div className="text-white text-5xl text-left">Use <span className="text-grapefruit-500">AI</span> to boost your</div>
            <div className="text-5xl text-grapefruit-500 h-10">
                <Typewriter text="productivity" delay={100}></Typewriter>
            </div>
            <div className="text-white text-left mt-5 text-xl">Get more out of generative AI with these prompts.</div>
          </div>
          <div className="circuit"></div>
        </div>
        <div className="flex items-center justify-center w-20 h-20 cursor-pointer" onClick={handleScroll} ref={ref}>
          <ChevronDown width="40" height="40" className="text-grapefruit-500 mb-10 hover:text-grapefruit-300"></ChevronDown>
        </div>
      </div>
      <div className="flex flex-col gap-8 items-center">
        <h1 className="text-4xl pt-10">Featured Prompts</h1>
        { loading && <div className="loading-circle"></div>}
        { error && <div>Error: {error}</div>}
        { data && <Grid prompts={data}></Grid>}
        <Link to={'/prompts'}>
            <Button className="min-w-min bg-plum-800 hover:bg-plum-700">View All Prompts <ChevronRight></ChevronRight></Button>
        </Link>
      </div>
      <Footer></Footer>
    </div>
  )
}
