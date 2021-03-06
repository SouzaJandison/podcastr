import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Slider from 'rc-slider';

import { usePlay } from '../../contexts/PlayerContext';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import 'rc-slider/assets/index.css';
import styles from './styles.module.scss';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  const { 
    episodeList, 
    currentEpisodeIndex, 
    isPlaying, 
    isLooping,
    isShuffling,
    hasNext,
    hasPrevious,
    togglePlay,
    toggleLoop,
    toggleShuffle,
    setPlayingState,
    playNext,
    playPrevious,
    cleanPlayerState
  } = usePlay();

  useEffect(() => {
    if(!audioRef.current) return;

    if(isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const episode = episodeList[currentEpisodeIndex];

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEndend() {
    if(hasNext) {
      playNext();
    } else {
      cleanPlayerState();
    }
  }

  return(
    <div className={styles.plyerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong>Tocando agora</strong>
      </header>

      {episode 
        ? (
          <div className={styles.correntEpisode}>
            <Image 
              width={592}
              height={592}
              src={episode.thumbnail}
              objectFit="cover"
            />
            <strong>{episode.title}</strong>
            <span>{episode.members}</span>
          </div>
        ) 
        : (
          <div className={styles.emptyPlayer}>
            <strong>Selecione um podcast para ouvir</strong>
          </div>
        )
      }

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{
            episode
              ? convertDurationToTimeString(progress)
              : '00:00'
          }</span>
          <div className={styles.slider}>
            {episode
              ? (
                <Slider 
                  max={203}
                  value={progress}
                  onChange={handleSeek}
                  trackStyle={{ backgroundColor: '#04d361' }}
                  railStyle={{ backgroundColor: '#9f75ff' }}
                  handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                />
              )
              : (
                <div className={styles.emptySlider} />
              )
            }
          </div>
          <span>{
            episode
              ? convertDurationToTimeString(episode.duration)
              : '00:00'
          }</span>
        </div>
        
        {episode && (
          <audio 
            src={episode.url}
            ref={audioRef}
            loop={isLooping}
            autoPlay
            onEnded={handleEpisodeEndend}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button 
            type="button" 
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button 
            type="button" 
            onClick={playPrevious} 
            disabled={!episode || !hasPrevious}
          > 
            <img src="/play-previous.svg" alt="Tocar anterior"/>
          </button>
          <button 
            type="button"  
            disabled={!episode} 
            className={styles.playButton}
            onClick={() => togglePlay()}
          >
            {isPlaying
              ? (
                <img src="/pause.svg" alt="Pausa"/>
              )
              : (
                <img src="/play.svg" alt="Tocar"/>
              )
            }
          </button>
          <button 
            type="button" 
            onClick={playNext} 
            disabled={!episode || !hasNext}
          >
            <img src="/play-next.svg" alt="Tocar Pr??xima"/>
          </button>
          <button 
            type="button"  
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir"/>
          </button>
        </div>
      </footer>
    </div>
  );
}