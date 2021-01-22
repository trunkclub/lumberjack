/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

import { NavItemT } from '../_types'

import Header from './Header'
import './main.scss'

type PropsT = {
  children: React.ReactNode
  navigation?: {
    byFeature: NavItemT[]
    byReportId: NavItemT[]
  }
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
    <div className="Layout">
      <Header
        navigation={navigation}
      />
      <main className="Main">{children}</main>
    </div>
  )
}

export default Layout
