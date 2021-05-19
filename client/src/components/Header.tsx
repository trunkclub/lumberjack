import { Link } from 'gatsby'
import React from 'react'

import { Box, Heading } from '../pattern-library'

import { NavItemT } from '../_types' 

// @ts-ignore - FIXME
import Logo from '../images/Logo.svg'

type PropsT = {
  navigation: NavItemT[]
}

const Header = ({
  navigation,
}: PropsT) => (
  <Box
    variant="gradientBackground"
    as="header"
    height="100%"
    width="19rem"
    p={2}
    sx={{
      position: 'fixed',
    }}
  >
    <img src={Logo} width="200" alt="Lumberjack" />
    <div role="navigation" className="navigation">

      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About the data and project</Link></li>
      </ul>

      <Heading as="h2" variant="bodyLarge">Impact Summaries:</Heading>
      <ul>
        <li>
          <Link to='/report/by-impact/critical'>Critical</Link>
        </li>
        <li>
          <Link to='/report/by-impact/serious'>Serious</Link>
        </li>
        <li>
          <Link to='/report/by-impact/moderate'>Moderate</Link>
        </li>
        <li>
          <Link to='/report/by-impact/minor'>Minor</Link>
        </li>
      </ul>

      <Heading as="h2" variant="bodyLarge">Reports by Feature:</Heading>
      <ul>
        {navigation.map(entry => (
          <li key={entry.id}>
            <Link to={`/report/feature/${entry.id}`}>{entry.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  </Box>
)

export default Header
