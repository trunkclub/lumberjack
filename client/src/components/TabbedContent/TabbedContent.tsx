import React, { useState } from 'react'

import { Box, Flex } from '../../pattern-library'

import Tab from './components/Tab'
import TabPanel from './components/TabPanel'

// import ElementInstance from '../ElementInstance'
// import Fixes from '../Fixes'

type PropsT = {
  details: React.ReactNode
  whatToFix: React.ReactNode
}

const TabbedContent = ({ details, whatToFix }: PropsT) => {

  const [ currentTab, setCurrentTab ] = useState('details')

  return (
    <Box
      role="tablist"
      sx={{
        position: 'relative',
        zIndex: 1,
      }}
    >

      <Flex
        justifyContent="flex-start"
        sx={{
          position: 'relative',
        }}
      >
        <Tab
          handleClick={(id) => { setCurrentTab('details')}}
          id="details"
          isActive={currentTab === 'details'}
          mr={1}
          panelId="detailsContent"
        >
          Details:
        </Tab>
        <Tab
          handleClick={(id) => { setCurrentTab('what')}}
          id="what"
          isActive={currentTab === 'what'}
          panelId="whatContent"
        >
          What to Fix:
        </Tab>
      </Flex>

      <Box
        p={2}
        sx={{
          borderColor: 'borders.decorative',
          borderStyle: 'solid',
          borderWidth: '1px',
          position: 'relative',
          top: '-1px',
        }}
      >
        <TabPanel
          id="detailsContent"
          isActive={currentTab === 'details'}
          tabId="details"
        >
          {details}
        </TabPanel>
        <TabPanel
          id="whatContent"
          isActive={currentTab === 'what'}
          tabId="what"
        >
          {whatToFix}
        </TabPanel>
      </Box>
    </Box>
  )
}

export default TabbedContent