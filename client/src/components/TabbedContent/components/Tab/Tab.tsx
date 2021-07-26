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
      bg="transparent"
      color="text.main"
      id={id}
      onClick={() => handleClick(id)}
      py={1}
      px={2}
      role="tab"
      type="button"
      sx={{
        borderColor: isActive ? 'borders.division' : 'transparent',
        borderRadius: '0',
        borderStyle: 'solid',
        borderWidth: '0 0 2px 0',
        cursor: 'pointer',
      }}
      {...rest}
    >
      {children}
    </Button>
  )
}

export default Tab
