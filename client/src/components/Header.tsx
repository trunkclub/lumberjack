import { Link } from 'gatsby'
import React from 'react'

import { Box, BoxProps } from '../pattern-library'

import { NavItemT } from '../_types' 

// @ts-ignore - FIXME
import Logo from '../images/Logo.svg'

type PropsT = {
  showHome?: boolean
  navigation: NavItemT[]
}

const Header = ({
  showHome = true,
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
      <div className="navigation">

        {showHome && (
          <Link to="/">Homepage</Link>
        )}

        <h3>Impact Summaries:</h3>
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

        
        {navigation && (
          <>
            <h3>Reports by Feature:</h3>
            <ul>
              {navigation.map(entry => (
                <li key={entry.id}>
                  <Link to={`/report/feature/${entry.id}`}>{entry.name}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
  </Box>
)

export default Header
