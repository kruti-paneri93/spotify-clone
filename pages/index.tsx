import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Sidebar from '../components/Sidebar'
import Center from '../components/Center';
import Player from '../components/Player';
import { getSession } from 'next-auth/react';


export default function Home () {
  return (
    <div className="bg-black h-screen overflow-hidden">
      <Head>
        <title>Spotify Clone</title>
      </Head>
      <div className='flex'>
        <Sidebar />
        <Center />
      </div>
      <div className='sticky bottom-0'>
        <Player />
      </div>
    </div>
  )
}

export async function getServerSideProps(context : any){
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}
