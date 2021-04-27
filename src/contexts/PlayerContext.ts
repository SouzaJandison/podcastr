import { createContext } from 'react';

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
  play: (episode: IEpisode) => void;
  togglePlay: () => void;
  setPlayingState: (state: boolean) => void;
}

export const PlayerContext = createContext({} as IPlayerContextData);