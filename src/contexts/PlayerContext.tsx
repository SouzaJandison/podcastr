import { createContext, useState, ReactNode, useContext } from 'react';

interface IEpisode {
  title: string;
  members: string;
  thumbnail: string;
  url: string;
  duration: number,
}

interface IPlayerContextData {
  episodeList: IEpisode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  play: (episode: IEpisode) => void;
  playList: (list: IEpisode[], index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  setPlayingState: (state: boolean) => void;
  cleanPlayerState: () => void;
}

interface PlayerContextProviderProps {
  children: ReactNode;
}

const PlayerContext = createContext({} as IPlayerContextData);

export function PlayerContextProvide({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode: IEpisode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: IEpisode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  const hasNext = (currentEpisodeIndex + 1) < episodeList.length || isShuffling;
  const hasPrevious = currentEpisodeIndex > 0;

  function playNext() {
    if(isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    }else if(hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {
    if(hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function toggleShuffle() {
    setIsShuffling(!isShuffling);
  }

  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  function cleanPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  return(
    <PlayerContext.Provider 
      value={{ 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        isLooping,
        isShuffling,
        hasNext,
        hasPrevious,
        play,
        playList, 
        playNext,
        playPrevious,
        togglePlay,
        toggleLoop,
        toggleShuffle,
        setPlayingState,
        cleanPlayerState
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlay = () => {
  return useContext(PlayerContext);
}