import { Button, ToggleButtonGroup } from '@mui/joy';
import { Locales, useTonConnectUI } from '@tonconnect/ui-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { appLanguages } from '../types';

export const LanguagePicker = () => {
  const { t, i18n } = useTranslation();
  const [_, setOptions] = useTonConnectUI();

  useEffect(() => {
    setOptions({ language: i18n.language as Locales });
  }, [i18n.language]);

  return (
    <ToggleButtonGroup
      size="sm"
      value={i18n.language}
      onChange={(event, newValue) => {
        i18n.changeLanguage(newValue || 'en');
      }}
    >
      {appLanguages.map((lang, index) => (
        <Button
          title={t(`language.list.${lang}`)}
          key={`app-language-${index}`}
          color="neutral"
          value={lang}
          variant="plain"
        >
          {t(`language.short.${lang}`)}
        </Button>
      ))}
    </ToggleButtonGroup>
  );
};
