import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../components/Sidebar'
import MainContent from '../components/MainContent';

const Home: NextPage = () => {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify Clone</title>
      </Head>
      <div className='flex w-full'>
        <div className='w-56'>
          <Sidebar />
        </div>
        <div >
          <MainContent/>
        </div>
      </div>
    </div>
  )
}

export default Home
