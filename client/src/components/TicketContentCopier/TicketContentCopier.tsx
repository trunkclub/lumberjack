import React from 'react'

import { Box, Button, Flex } from '../../pattern-library'

import { UniqueViolation } from '../../../../lumberjack.types'

type PropsT = {
  element: string
  instances: number
  routes: string[]
  violation: UniqueViolation
}

const TicketContentCopier = ({
  element,
  instances,
  routes,
  violation,
}: PropsT) => {

  const [contentStatus, setContentStatus] = React.useState('')
  const panelRef = React.createRef<HTMLElement>()

  const copyContent = () => {

    const panelContent = panelRef.current?.innerText

    navigator.permissions.query({ name: 'clipboard-write' }).then(result => {
      if (result.state === 'granted' || result.state === 'prompt') {
        navigator.clipboard.writeText(panelContent).then(
          (content) => {
            setContentStatus('Content copied!')
          },
          () => {
            setContentStatus('Unable to copy.')
          }
        )
      }
    })

    setTimeout(() => {
      setContentStatus(' ')
    }, 5000)
  }

  return (
    <Flex alignItems="center" mt={2}>
      <Button
        bg="backgrounds.alt"
        color="inherit"
        onClick={copyContent}
        sx={{
          cursor: 'pointer'
        }}
      >
        Copy Ticket Content
      </Button>

      <Box pl={2}>{contentStatus}</Box>

      <Box
        as="pre"
        aria-hidden={true}
        ref={panelRef}
        p={0}
        sx={{
          height: '0',
          position: 'absolute',
          overflow: 'hidden',
          width: '0',
        }}
      >
        <p>## {violation.description}</p>
        <p>**Summary:** Violation is triggered by the element below. Element appears {instances} time{instances > 1 ? 's' : ''} across {routes.length} route{routes.length > 1 ? 's' : ''}.</p>
        <p>**User Impact:** {violation.impact}</p>
        <p>[Learn more]({violation.helpUrl}) about how to fix this issue.</p>
        <p> </p>
        <p>----</p>
        <p> </p>
        <p>**Element triggering violation:**</p>
        <p>```{element}```</p>
        <p> </p>
        <p>**Routes impacted:**</p>
        {routes.map((route, index) => (
          <div key={`${violation.id}-ticket-${index}`}>
            - {route}
          </div>
        ))}
      </Box>
    </Flex>
  )
}

export default TicketContentCopier
