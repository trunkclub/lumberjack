import React from "react"
import { ThemeProvider as RebassThemeProvider } from 'emotion-theming'
import { createGlobalStyle } from 'styled-components'
import theme from './theme'

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap');

  html, body {
    font-family: Cairo, Helvetica, Arial, sans-serif;
    margin: 0;
    padding: 0;
  }

  a {
    font-weight: 600;
    color: inherit;
    text-decoration: underline;
  }

  pre {
    background: ${theme.colors.backgrounds.faded};
    padding: 1rem;
    max-width: 100%;
    overflow-x: scroll;
  }
`

const ThemeProvider = ({ children }) => (
  <RebassThemeProvider theme={theme}>
    <GlobalStyle />
    {children}
  </RebassThemeProvider>
)

export default ThemeProvider
