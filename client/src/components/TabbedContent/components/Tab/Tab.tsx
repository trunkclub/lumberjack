import React from 'react'

import { Button, ButtonProps } from '../../../../pattern-library'

export type PropsT = {
  children: React.ReactNode
  isActive: boolean
  handleClick: (id:string) => void
  id: string
  panelId: string
} & ButtonProps

const Tab = ({ children, isActive, handleClick, id, panelId, ...rest }: PropsT) => {
  
  // id and panelId are needed to create an accessible connection
  // between the elements.
  if (!id || !panelId) {
    return null
  }
  
  return (
    <Button
      aria-controls={panelId}
      aria-selected={isActive}
      bg={isActive ? 'backgrounds.main' : 'backgrounds.alt'}
      color="text.main"
      id={id}
      onClick={() => handleClick(id)}
      py={2}
      px={2}
      role="tab"
      type="button"
      sx={{
        borderColor: isActive ? 'borders.decorative' : 'transparent',
        borderRadius: '0',
        borderStyle: 'solid',
        borderWidth: '1px 1px 0 1px',
        cursor: 'pointer',
        zIndex: isActive ? 2 : 0,
      }}
      {...rest}
    >
      {children}
    </Button>
  )
}

export default Tab
