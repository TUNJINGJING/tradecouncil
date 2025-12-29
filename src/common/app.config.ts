/**
 * Application Identity (Brand)
 *
 * Also note that the 'Brand' is used in the following places:
 *  - README.md               all over
 *  - package.json            app-slug and version
 *  - [public/manifest.json]  name, short_name, description, theme_color, background_color
 */
export const Brand = {
  Title: {
    Base: 'TradeCouncil',
    Common: (process.env.NODE_ENV === 'development' ? '[DEV] ' : '') + 'TradeCouncil',
  },
  Meta: {
    Description: 'AI-powered trading analysis platform with multiple expert strategies. Get professional trading analysis with preset strategies for scalping, day trading, swing trading, and investing.',
    SiteName: 'TradeCouncil | AI Trading Analysis',
    ThemeColor: '#32383E',
    TwitterSite: '',
  },
  URIs: {
    Home: 'https://tradecouncil.vercel.app',
    CardImage: '',
    OpenRepo: '',
    OpenProject: '',
    SupportInvite: '',
    PrivacyPolicy: '',
    TermsOfService: '',
  },
  Docs: {
    Public: (docPage: string) => `https://tradecouncil.vercel.app/docs/${docPage}`,
  }
} as const;