/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

import React from 'react'
import ThemeProvider from './src/pattern-library/ThemeProvider'

export const wrapRootElement = ({ element, props }) => {
  return <ThemeProvider {...props}>{element}</ThemeProvider>
}
