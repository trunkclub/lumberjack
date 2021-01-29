/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// @ts-check

import React from 'react'
import ThemeProvider from './src/pattern-library/ThemeProvider'

export const wrapPageElement = ({ element, props }) => {
  return <ThemeProvider {...props}>{element}</ThemeProvider>
}
