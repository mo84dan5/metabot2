// URLパラメータからAPIキーを取得
export const getApiKeyFromUrl = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('OPENAI_API_KEY');
};

// テストモードかどうかを判定
export const isTestMode = (): boolean => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('test') === 'true' || !getApiKey();
};

// APIキーの取得（URLパラメータ優先、なければLocalStorage）
export const getApiKey = (): string | null => {
  const urlKey = getApiKeyFromUrl();
  if (urlKey) return urlKey;
  
  const storedSettings = localStorage.getItem('metabot2-storage');
  if (storedSettings) {
    try {
      const parsed = JSON.parse(storedSettings);
      return parsed.state?.apiSettings?.openaiApiKey || null;
    } catch (error) {
      console.error('Failed to parse stored settings:', error);
    }
  }
  return null;
};