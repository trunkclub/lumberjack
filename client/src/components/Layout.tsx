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

const Layout = ({ children }: PropsT) => {
  const data = useStaticQuery(graphql`
    query SideNavQuery {
      site {
        siteMetadata {
          appName
        }
      }
      allSummariesJson(sort: {fields: reportId, order: DESC}, limit: 1) {
        nodes {
          reportId
          features {
            id
            name
          }
          routes {
            numberChecked
          }
        }
      }
    }
  `)

  const appName = data?.site?.siteMetadata?.appName
  const navigation = data?.allSummariesJson?.nodes[0]?.features || []

  return (
    <Box
      display='grid'
      minHeight="100vh"
      minWidth="100vw"
      sx={{
        gridTemplateColumns: '19rem auto',
        gridTemplateRows: '100%',
        overflowY: 'scroll',
      }}
    >
      <Box>
        <Header
          appName={appName}
          navigation={navigation}
        />
      </Box>
      <Flex
        as="main"
        alignSelf="stretch"
        justifyContent="center"
        px={4}
        py={2}
      >
        <Box
          width="100%"
        >
          {children}
        </Box>
      </Flex>
    </Box>
  )
}

export default Layout
