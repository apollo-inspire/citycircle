/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */



const basicColors = {
  gray: {
    950: '#030712',
    900: '#101828',
    800: '#1E2939',
    700: '#364153',
    500: '#6A7282',
    400: '#99A1AF',
    300: '#D1D5DC',
    100: '#F3F4F6',
    50: '#F9FAFB',
  },
  primary: {
    500: '#AF7D00',
    400: '#FFC021',
    300: '#FDC95B',
    100: '#FFF0B9',
  },
  secondary: {
    700: '#4300AF',
    600: '#6E1BF4',
    400: '#B688FF',
    300: '#EEBFFF',
  },
  tertiary: {
    700: '#0034AF',
    600: '#5386FF',
    400: '#8BADFF',
    300: '#BBD4FF',
  },
  state: {
    succes: {
      500: '#007C23',
      400: '#2FA04E',
      300: '#83E89F',
      200: '#BFFFD1',
    },
    warning: {
      500: '#9F8400',
      300: '#FFE566',
      200: '#FFF0B9',
    },
    error: {
      500: '#AF0006',
      400: '#E75A60',
      300: '#F2A6A9',
      200: '#FFCCCE',
    },
    neutral: {
      500: '#00887F',
      300: '#31EBDF',
      200: '#BFFFFB',
    },
  }
};

export const Colors = {
  // light: {
  //   text: '#11181C',
  //   background: '#fff',
  //   tint: #0a7ea4,
  //   icon: '#687076',
  //   tabIconDefault: '#687076',
  //   tabIconSelected: #0a7ea4,
  // },
  dark: {
    text: basicColors.gray[100],
    textLowcontrast: basicColors.gray[300],
    background: basicColors.gray[950],
    background900: basicColors.gray[900],
    backgroundCard: basicColors.gray[800],
    icon: basicColors.gray[400],
    tabIconDefault: basicColors.gray[400],
    tint: '#fff',
    tabIconSelected: '#fff',
    link: basicColors.tertiary[400],
    buttonGray: basicColors.gray[700] 
  },
  basic: basicColors,
};
