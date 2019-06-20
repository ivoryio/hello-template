import React from 'react'
import { navigate } from '@reach/router'

import Touchable from '@kogaio/Touchable'
import { Flex } from '@kogaio/Responsive'
import Typography from '@kogaio/Typography'

const Header = () => {
  const _escapeToLanding = () => navigate('/')
  return (
    <Flex
      alignItems='center'
      bg='gunmetal'
      height='80px'
      justifyContent='center'
      width={1}>
      <Touchable effect='opacity' onClick={_escapeToLanding}>
        <Typography color='white' variant='h3'>
          Welcome
        </Typography>
      </Touchable>
    </Flex>
  )
}

export default Header
