import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"

import Logo from '../images/Logo.svg'

const Header = ({
  showHome=true,
  siteTitle,
  navigation
}) => (
  <header className="Header">
    <img src={Logo} width="200" alt="Lumberjack" />
      <div className="navigation">

        {showHome && (
          <Link to="/">Homepage</Link>
        )}

        <h3>Report Summaries:</h3>
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
            <h3>Violation Details:</h3>
            <ul>
              {navigation.map(entry => {
                return (<li><a href={`#${entry.reportId}`}>{entry.date}</a></li>)
              })}
            </ul>
          </>
        )}
      </div>
  </header>
)

// Header.propTypes = {
//   siteTitle: PropTypes.string,
// }

// Header.defaultProps = {
//   siteTitle: ``,
// }

export default Header
