import { THEME, TonConnectUIProvider } from '@tonconnect/ui-react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import './i18n';
import './index.css';
import { Routes } from './routes';

// this manifest is used temporarily for development purposes
const manifestUrl = 'https://spintria-ton.github.io/spintria-wallet/tonconnect-manifest.json';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <TonConnectUIProvider
    manifestUrl={manifestUrl}
    uiPreferences={{
      theme: THEME.DARK,
    }}
  >
    <BrowserRouter>
      <RecoilRoot>
        <Routes />
      </RecoilRoot>
    </BrowserRouter>
  </TonConnectUIProvider>,
);
