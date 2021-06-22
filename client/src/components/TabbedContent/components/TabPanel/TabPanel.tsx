import React from 'React'

import { Box } from '../../../../pattern-library'

type PropsT = {
  children,
  id: string
  isActive: boolean
  tabId: string
}

const TabPanel = ({
  children,
  isActive,
  id,
  tabId,
}: PropsT) => {

  if (!id || !tabId) {
    return null
  }

  // const panelRef = React.useRef<HTMLElement | null>(null)

  // React.useEffect(() => {
  //   if (isActive && panelRef?.current) {
  //     panelRef.current.focus()
  //   }
  // }, [isActive, panelRef])

  return (
    <Box
        aria-hidden={!isActive}
        aria-labelledby={tabId}
        id={id}
        // ref={panelRef}
        role="tabpanel"
        tabIndex={isActive ? -1 : null}
        height={isActive ? undefined : '0'}
        overflowY={isActive ? undefined : 'hidden'}
        sx={{
          opacity: isActive ? '1' : '0',
          transition: 'opacity ease-in 0.2s',
          position: 'relative',
          visibility: isActive ? undefined : 'hidden',
          zIndex: 1,

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
