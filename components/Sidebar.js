import React, { useState, useEffect } from 'react';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LibraryMusicOutlinedIcon from '@mui/icons-material/LibraryMusicOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import RssFeedOutlinedIcon from '@mui/icons-material/RssFeedOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import { signOut, useSession } from 'next-auth/react';
import useSpotify from '../hooks/useSpotify';
import {playlistIdState} from '../atoms/playlistAtom';
import {useRecoilState} from 'recoil';


function Sidebar() {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [playlists, setPlaylist] = useState([]);
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
    
    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi.getUserPlaylists().then((data) => {
                setPlaylist(data.body.items);
            });
        }
    }, [session, spotifyApi])

    return (
        <div className='text-gray-500 p-5 border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36'>
            <div className='space-y-4'>
                <button className='flex item-end space-x-2 hover:text-white' onClick={() => signOut()}>
                    <LogoutIcon className='h-7 w-7' />
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
                    <FavoriteIcon className='h-7 w-7 text-red-700' />
                    <p>Liked Songs</p>
                </button>
                <button className='flex item-end space-x-2 hover:text-white'>
                    <RssFeedOutlinedIcon className='h-7 w-7' />
                    <p>Your Episode</p>
                </button>
                <hr className='border-t-[0.1px] border-gray-900' />

                {playlists.map((playlist) => (
                <p key={playlist.id} onClick={() => setPlaylistId(playlist.id)} className='cursor-pointer hover:text-white'>
                    {playlist.name}
                </p>
                ))}
            </div>

        </div>
    );
}

export default Sidebar;