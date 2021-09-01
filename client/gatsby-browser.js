/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// @ts-check

import React from 'react'
import ReactModal from 'react-modal'
import ThemeProvider from './src/pattern-library/ThemeProvider'

export const wrapPageElement = ({ element, props }) => {
  ReactModal.setAppElement('#___gatsby')
  return <ThemeProvider {...props}>
    {element}
  </ThemeProvider>
}
