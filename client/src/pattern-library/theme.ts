
const colors = {
  black: '#000',
  lightGrey: '#CCC',
  red: '#7D0000',
}

const roleColors = {
  actions: {
    primary: colors.black,
  },
  backgrounds: {
    alt: '#D2D8E1',
    faded: '#F7F7F7',
    main: '#FFF',
  },
  borders: {
    decorative: '#CCC',
    division: '#767676',
  },
  text: {
    main: colors.black,
  },
  trends: {
    positive: '#357935',
    negative: colors.red,
  }
}

const fontSizes = [
  '1rem', // 16px
  '1.125rem', //18px
  '1.25rem', // 20px
  '1.625rem', //32px
  '2.25rem',
]
const fontStack = 'Cairo, Helvetica, Arial, sans-serif'
const baseTextStyle = {
  color: roleColors.text.main,
  fontFamily: fontStack,
  fontWeight: '400',
  lineHeight: '1.4em',
  maxWidth: '70ch',
}

const typography = {
  largeHeadline: {
    ...baseTextStyle,
    fontSize: fontSizes[4],
    fontWeight: '700',
  },
  standardHeadline: {
    ...baseTextStyle,
    fontSize: fontSizes[3],
    fontWeight: '400',
  },
  smallHeadline: {
    ...baseTextStyle,
    fontSize: fontSizes[0],
    textTransform: 'uppercase',
  },
  body: {
    ...baseTextStyle,
    fontSize: fontSizes[1],
    mb: 2,
  },
  bodyLarge: {
    ...baseTextStyle,
    fontSize: fontSizes[2],
    mb: 2,
  },
  bodySmall: {
    ...baseTextStyle,
    fontSize: fontSizes[0],
    lineHeight: '1.2em',
    mb: 2,
  },
}

const theme = {
  colors: roleColors,
  fonts: {
    body: fontStack,
    heading: 'inherit',
  },
  fontSizes: fontSizes,
  fontWeights: {
    body: 400,
    heading: 400,
    semibold: 600,
    bold: 700,
  },
  headings: {},
  space: [ '0', '0.5rem', '1.5rem', '3rem', '4rem', ],
  text: typography,
  variants: {
    link: {
      color: roleColors.text.main,
      fontWeight: 'semibold',
      textDecoration: 'underline',
    },
    lineList: {
      borderColor: 'borders.decorative',
      borderStyle: 'solid',
      borderWidth: '0 0 0 1px',
      mb: 2,
      p: 0,
      pt: 2,
      li: {
        lineHeight: '1.25',
        listStyleType: 'none',
        pb: 2,
        pl: 2,
        my: 0,
        position: 'relative',
        '::before': {
          borderColor: 'borders.decorative',
          borderStyle: 'solid',
          borderWidth: '1px 0 0',
          content: '""',
          display: 'block',
          top: '0.625em',
          position: 'absolute',
          left: 0,
          width: '1rem',
        }
      },
    }
  },
}

export default theme