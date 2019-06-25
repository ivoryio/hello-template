import { createGlobalStyle } from 'styled-components'
import { themeGet } from '@kogaio'

export const GlobalStyle = createGlobalStyle`
  body {
    margin: ${themeGet('space.0')}px;
    padding: ${themeGet('space.0')}px;
    font-family: ${themeGet('fonts.primary')};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }
`
