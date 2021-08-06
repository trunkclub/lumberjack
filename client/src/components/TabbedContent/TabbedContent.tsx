import React, { useState } from 'react'

import { Box, Flex } from '../../pattern-library'

import Tab from './components/Tab'
import TabPanel from './components/TabPanel'

type PropsT = {
  details: React.ReactNode
  uniqueId: string
  whatToFix: React.ReactNode
}

const TabbedContent = ({ details, uniqueId, whatToFix }: PropsT) => {
  const [currentTab, setCurrentTab] = useState('details')

  const idMap = {
    details: {
      tab: `tab-${uniqueId}-details`,
      panel: `panel-${uniqueId}-details`,
    },
    whatToFix: {
      tab: `tab-${uniqueId}-whatToFix`,
      panel: `panel-${uniqueId}-whatToFix`,
    },
  }

  return (
    <Box
      role="tablist"
      sx={{
        position: 'relative',
        zIndex: 1,
      }}
    >

      <Flex justifyContent="flex-start" >
        <Tab
          handleClick={() => { setCurrentTab('details') }}
          id={idMap.details.tab}
          isActive={currentTab === 'details'}
          mr={1}
          panelId={idMap.details.panel}
        >
          Details
        </Tab>
        <Tab
          handleClick={() => { setCurrentTab('what') }}
          id={idMap.whatToFix.tab}
          isActive={currentTab === 'what'}
          panelId={idMap.whatToFix.panel}
        >
          What to Fix
        </Tab>
      </Flex>

      <Box
        pt={2}
        sx={{
          borderColor: 'borders.decorative',
          borderStyle: 'solid',
          borderWidth: '1px 0 0',
        }}
      >
        <TabPanel
          id={idMap.details.panel}
          isActive={currentTab === 'details'}
          tabId={idMap.details.tab}
        >
          {details}
        </TabPanel>
        <TabPanel
          id={idMap.whatToFix.panel}
          isActive={currentTab === 'what'}
          tabId={idMap.whatToFix.tab}
        >
          {whatToFix}
        </TabPanel>
      </Box>
    </Box>
  )
}

export default TabbedContent
