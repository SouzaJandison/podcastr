import '../styles/global.scss';

import { PlayerContextProvide } from '../contexts/PlayerContext';
import { Header } from '../components/Header';
import { Player } from '../components/Player';

import styles from '../styles/app.module.scss';

function MyApp({ Component, pageProps }) {
  return(
    <PlayerContextProvide>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvide>
  );
}

export default MyApp;
