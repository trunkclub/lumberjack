import { Link } from "gatsby"
import React from "react"

import { NavItemT } from '../_types' 

// @ts-ignore - FIXME
import Logo from '../images/Logo.svg'

type PropsT = {
  showHome?: boolean
  navigation: {
    byFeature: NavItemT[]
    byReportId: NavItemT[]
  }
}

const Header = ({
  showHome = true,
  navigation
}: PropsT) => (
  <header className="Header">
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
              {navigation.byFeature.map(entry => (
                <li key={entry.id}><a href={`/report/feature/${entry.id}`}>{entry.name}</a></li>
              ))}
            </ul>
            <h3>Reports by Report ID:</h3>
            <ul>
              {navigation.byReportId.map(entry => (
                <li key={entry.id}><a href={`#${entry.id}`}>{entry.name}</a></li>
              ))}
            </ul>
          </>
        )}
      </div>
  </header>
)

export default Header
