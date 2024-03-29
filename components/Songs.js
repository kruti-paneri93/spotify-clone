import {useRecoilValue} from 'recoil';
import {playlistState} from "../atoms/playlistAtom";
import Song from '../components/Song';
function Songs() {
    const playlist = useRecoilValue(playlistState)
  return (
    <div className='px-8 flex flex-col space-y-1 pb-28 text-white'>
        {playlist?.tracks.items.map((track, i) => (
            // <div>{track.track.name} track={track} order={i}</div>
            <Song key={track.track.id} track={track} order={i} />
        ))}
    </div>
  )
}

export default Songs