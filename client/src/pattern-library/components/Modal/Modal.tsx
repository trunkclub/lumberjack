import React from 'react'
import ReactModal from 'react-modal'

import { Box, Button } from '../..'


const Modal = (props) => {

  const { handleCloseModal } = props
  
  return (
    <ReactModal
      {...props}
      style={{
        overlay: {
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'center',
        }
      }}
      contentElement={(props, children) => (
        <Box
          {...props}
          // Clear out passed in class name and inline styling:
          className={null}
          style={null}
          // Lumberjack overrides:
          bg="backgrounds.main"
          p={4}
          sx={{
            borderColor: 'borders.division',
            borderStyle: 'solid',
            borderWidth: '1px',
            position: 'absolute',
            zIndex: '5000'
          }}
        >
          <Button
            variant="link"
            onClick={handleCloseModal}
            p={1}
            sx={{
              position: 'absolute',
              right: 2,
              top: 2,
            }}
          >
            Close
          </Button>
          {children}
          </Box>
      )}
      preventScroll={true}
    />
  )
}

export default Modal
