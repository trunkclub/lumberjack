import React, { Component } from 'react'

export default class TableOfContents extends Component {
  createLinks(data) {
    const links = []
    links.push(
      data.map((type, index) => {
        return (
          <li key={`toc-${type.route.id}`}>
            <a href={`#${type.route.id}`}>{type.title}</a>
          </li>
        )
      })
    )

    return links
  }

  render() {
    return <ul>{this.createLinks(this.props.data)}</ul>
  }
}
