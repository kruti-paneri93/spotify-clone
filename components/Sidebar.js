import React, { useState, useEffect } from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import RssFeedOutlinedIcon from '@mui/icons-material/RssFeedOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import { signOut, useSession } from 'next-auth/react';
import useSpotify from '../hooks/useSpotify'


function Sidebar() {
    const spotifyApi = useSpotify();
    const {data: session, status} = useSession();
    const [playlist , setPlaylist] = useState([]);

    useEffect(() => {
        if(spotifyApi.getAccessToken()){
            spotifyApi.getUserPlaylists().then((data) => {
                setPlaylist(data.body.items);
            });
        }
    }, [session, spotifyApi])

    console.log(playlist);
    return (
        <div className='text-gray-500 p-5 border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide'>
            <div className='space-y-4'>
                <button className='flex item-end space-x-2 hover:text-white' onClick={() => signOut()}>
                    <HomeOutlinedIcon className='h-7 w-7' />
                    <p>Logout</p>
                </button>
                <button className='flex item-end space-x-2 hover:text-white'>
                    <HomeOutlinedIcon className='h-7 w-7' />
                    <p>Home</p>
                </button>
                <button className='flex item-end space-x-2 hover:text-white'>
                    <SearchOutlinedIcon className='h-7 w-7' />
                    <p>Search</p>
                </button>
                <button className='flex item-end space-x-2 hover:text-white'>
                    <LibraryMusicOutlinedIcon className='h-7 w-7' />
                    <p>Your Library</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900' />
                <button className='flex item-end space-x-2 hover:text-white'>
                    <AddBoxOutlinedIcon className='h-7 w-7' />
                    <p>Create Playlist</p>
                </button>
                <button className='flex item-end space-x-2 hover:text-white'>
                    <FavoriteBorderOutlinedIcon className='h-7 w-7' />
                    <p>Liked Songs</p>
                </button>
                <button className='flex item-end space-x-2 hover:text-white'>
                    <RssFeedOutlinedIcon className='h-7 w-7' />
                    <p>Your Episode</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900' />
                <p className='cursor-pointer hover:text-white'>
                    Playlist Name
                </p>
                <p className='cursor-pointer hover:text-white'>
                    Playlist Name
                </p>
                <p className='cursor-pointer hover:text-white'>
                    Playlist Name
                </p>
                <p className='cursor-pointer hover:text-white'>
                    Playlist Name
                </p>
                <p className='cursor-pointer hover:text-white'>
                    Playlist Name
                </p>
            </div>

        </div>
    );
}

export default Sidebar;