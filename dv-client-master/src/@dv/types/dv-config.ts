export interface DvConfig {
  colorTheme: string;
  customScrollbars: boolean;
  layout: {
    width: 'fullwidth' | 'boxed',
    navbar: {
      primaryBackground: string,
      secondaryBackground: string,
      hidden: boolean,
      folded: boolean,
    },
    toolbar: {
      customBackgroundColor: boolean,
      background: string,
      hidden: boolean,
    }
  };
}
