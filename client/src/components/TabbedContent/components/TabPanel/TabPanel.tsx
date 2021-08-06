import React from 'react'

import { Box } from '../../../../pattern-library'

type PropsT = {
  children
  id: string
  isActive: boolean
  tabId: string
}

const TabPanel = ({
  children,
  isActive,
  id,
  tabId,
}: PropsT): React.ReactElement => {
  const panelRef = React.useRef<HTMLElement>()

  React.useEffect(() => {
    if (isActive && panelRef?.current) {
      panelRef.current.focus()
    }
  }, [isActive])

  if (!id || !tabId) {
    return null
  }

  return (
    <Box
      aria-hidden={!isActive}
      aria-labelledby={tabId}
      id={id}
      ref={panelRef}
      role="tabpanel"
      tabIndex={isActive ? -1 : null}
      height={isActive ? undefined : '0'}
      overflowY={isActive ? undefined : 'hidden'}
      sx={{
        opacity: isActive ? '1' : '0',
        transition: 'opacity ease-in 0.2s',
        position: 'relative',
        visibility: isActive ? undefined : 'hidden',

        '&:focus': {
          outline: isActive ? 'none' : undefined,
        },
      }}
    >
      {children}
    </Box>
  )
}

export default TabPanel
