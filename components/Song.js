import { useRecoilState } from 'recoil';
import useSpotify from '../hooks/useSpotify';
import { millsToMinutesAndSeconds } from '../lib/time';
import {currentTrackIdState, isPlayingState} from "../atoms/songAtom"
function Song({ order, track }) {
    const spotifyApi = useSpotify();
    const [currentTrack, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isplaying, setIsPlaying] = useRecoilState(isPlayingState);

    const playSong = () => {
        setCurrentTrackId(track.track.id);
        setIsPlaying(true);
        spotifyApi.play({
            uris: [track.track.uri],
        });
        console.log("song play function")
    };
    return (
        <div className='grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer' onClick={playSong} >
            <div className='flex items-center space-x-4'>
                <p>{order + 1}</p>
                <img className='h-10 w-10' src={track.track.album.images[0].url} alt='' />
                <div>
                    <p>{track.track.name}</p>
                    <p>{track.track.artists[0].name}</p>
                </div>
            </div>
            <div className='flex items-center justify-between ml-auto md:ml-0'>
                <p className='hidden md:inline'>{track.track.album.name}</p>
                <p>{millsToMinutesAndSeconds(track.track.duration_ms)}</p>
            </div>
        </div>
    );
}
export default Song;