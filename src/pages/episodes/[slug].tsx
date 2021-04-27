import { GetStaticPaths, GetStaticProps } from 'next';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Image from 'next/image';
import Link from 'next/link';

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
  episodes: IEpisodes;
}

export default function Episode({ episodes }: IEpisodesProps) {
  return (
    <div className={styles.episode}>
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
            src={episodes.thumbnail}
            objectFit="cover"
          />
          <button type="button">
            <img src="/play.svg" alt="Tocar Episódio"/>
          </button>
        </div>

        <header>
          <h1>{episodes.title}</h1>
          <span>{episodes.members}</span>
          <span>{episodes.publishedAt}</span>
          <span>{episodes.durationAsString}</span>
        </header>

        <div 
          className={styles.description} 
          dangerouslySetInnerHTML={{ __html: episodes.description }} 
        />
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;
  const { data } = await api.get(`episodes/${slug}`);

  const episodes = {
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
      episodes
    },
    revalidate: 60 * 60 * 24 // 24 hours
  }
}