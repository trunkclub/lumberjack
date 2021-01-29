import { InterpolationWithTheme } from '@emotion/core'

declare module 'rebass' {

  interface FlexProps {
    css?: InterpolationWithTheme<any>
  }

  interface BoxProps {
    css?: InterpolationWithTheme<any>
  }

  interface TextProps {
    css?: InterpolationWithTheme<any>
  }

  interface HeadingProps {
    css?: InterpolationWithTheme<any>
  }

  interface ButtonProps {
    css?: InterpolationWithTheme<any>
  }

  interface ImageProps {
    css?: InterpolationWithTheme<any>
  }

  // Add other interface extensions here for rebass.
  // See: https://github.com/rebassjs/rebass/issues/755#issuecomment-587250893
}

declare module '@rebass/forms' {
  interface InputProps {
    css?: InterpolationWithTheme<any>
  }

  interface SelectProps {
    css?: InterpolationWithTheme<any>
  }

  interface LabelProps {
    css?: InterpolationWithTheme<any>
  }

  // Add other interface extensions here for rebass forms.
  // See: https://github.com/rebassjs/rebass/issues/755#issuecomment-587250893
}

declare global {
  namespace JSX {
    interface IntrinsicAttributes {
      css?: InterpolationWithTheme<any>
    }
  }
}
