import { GetStaticPaths, GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

import { usePlay } from '../../contexts/PlayerContext';
import { api } from '../../services/api';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

import styles from '../../styles/episode.module.scss';

interface IEpisodes {
  id: string;      
  title: string;
  members: string;
  publishedAt: string;
  thumbnail: string;
  description: string;
  url: string;
  duration: number,
  durationAsString: string;
}

interface IEpisodesProps {
  episode: IEpisodes;
}

export default function Episode({ episode }: IEpisodesProps) {
  const { play } = usePlay();

  return (
    <div className={styles.episode}>
      <Head>
        <title>{episode.title} | Podcastr</title>
      </Head>

      <div className={styles.episodeContent}> 
        <div className={styles.thumbnailContainer}>
          <Link href="/">
            <button type="button">
              <img src="/arrow-left.svg" alt="Voltar"/>
            </button>
          </Link>
          <Image 
            width={700} 
            height={160} 
            src={episode.thumbnail}
            objectFit="cover"
          />
          <button type="button" onClick={() => play(episode)}>
            <img src="/play.svg" alt="Tocar Episódio"/>
          </button>
        </div>

        <header>
          <h1>{episode.title}</h1>
          <span>{episode.members}</span>
          <span>{episode.publishedAt}</span>
          <span>{episode.durationAsString}</span>
        </header>

        <div 
          className={styles.description} 
          dangerouslySetInnerHTML={{ __html: episode.description }} 
        />
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 2
    }
  });

  const paths = data.map(episode => {
    return {
      params: {
        slug: episode.id
      }
    }
  });

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  const { data } = await api.get(`episodes/${slug}`);

  const episode = {
      id: data.id,
      title: data.title,
      members: data.members,
      publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
      thumbnail: data.thumbnail,
      description: data.description,
      url: data.file.url,
      duration: data.file.duration,
      durationAsString: convertDurationToTimeString(data.file.duration)
  }

  return {
    props: {
      episode
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
}