/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

import { Box, Flex } from '../pattern-library'

import { NavItemT } from '../_types'

import Header from './Header'

type PropsT = {
  children: React.ReactNode
  navigation?: NavItemT[]
}

const Layout = ({ children, navigation }: PropsT) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <Box
      display='grid'
      height="100vh"
      width="100vw"
      sx={{
        gridTemplateColumns: '19rem auto',
        gridTemplateRows: '100%',
        overflowY: 'scroll',
      }}
    >
      <Box>
        <Header
          navigation={navigation}
        />
      </Box>
      <Flex
        as="main"
        justifyContent="center"
      >
        <Box
          px={4}
          width="100%"
        >
          {children}
        </Box>
      </Flex>
    </Box>
  )
}

export default Layout
