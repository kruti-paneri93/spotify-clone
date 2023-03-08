import { useSession } from "next-auth/react";
import { useState, useEffect , useCallback} from "react";
import { useRecoilState } from "recoil";
import useSpotify from "../hooks/useSpotify";
import useSongInfo from "../hooks/useSongInfo";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import ShuffleOutlinedIcon from '@mui/icons-material/ShuffleOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import RepeatIcon from '@mui/icons-material/Repeat';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import {debounce} from 'lodash';
function Player() {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [currentTrackId, setCurrentIdTrack] = useRecoilState(currentTrackIdState);
    const [isplaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(80);
    const songInfo = useSongInfo();

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then(data => {
                console.log("Now Playing", data.body?.item);
                setCurrentIdTrack(data.body?.item?.id);


                spotifyApi.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                })
            })
        }
    }


    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then(data => {
            if (data.body.is_playing) {
                spotifyApi.pause();
                setIsPlaying(false);
            }
            else {
                spotifyApi.play();
                setIsPlaying(true);
            }
        });
    };

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong();
            setVolume(80);
        }
    }, [currentTrackIdState, spotifyApi, session])

    useEffect(() => {
        if(volume > 0 && volume < 100 ){
            debouncedAdjustVolume(volume);
        }
    }, [volume]);

    const debouncedAdjustVolume = useCallback(
        debounce((volume) => {
            spotifyApi.setVolume(volume).catch((err) => {});
        }, 500), []
    )
    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            <div className="flex items-center space-x-4">
                <img className="hidden md:inline h-10 w-10" src={songInfo?.album.images?.[0]?.url} alt="" />
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>

            {/* center */}
            <div className="flex items-center justify-evenly">
                <ShuffleOutlinedIcon className="button" />
                <SkipPreviousIcon className="button" onClick={() => spotifyApi.skipToPrevious()} />
                <div className=' rounded-full bg-slate-50 h-10 w-10 flex items-center justify-center'>
                    {isplaying ? (
                        <PauseIcon onClick={handlePlayPause} className=" button text-zinc-900" />
                    ) : (
                        <PlayArrowIcon onClick={handlePlayPause} className="button text-zinc-900" />
                    )}
                </div>
                < SkipNextIcon className="button" onClick={() => spotifyApi.skipToNext()} />
                < RepeatIcon className="button" />
            </div>

            {/* Right */}
            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeDownIcon onClick={() => volume > 0 && setVolume(volume-10)} className="button"/>
                <input
                 value={volume}
                 onChange={e => setVolume(Number(e.target.value))}
                 className="w-14 md:w-28 accent-white"
                 type="range"
                 min={0} max={100} />
                <VolumeUpIcon onClick={() => volume < 100 && setVolume(volume + 100)} className="button"/>
            </div>
        </div>
    )
}

export default Player