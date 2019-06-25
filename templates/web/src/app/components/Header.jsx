import React from 'react'
import PropTypes from 'prop-types'
import { navigate } from '@reach/router'

import { UserMenu } from '@user'
import { Flex, Space, TopBar, Touchable, Typography } from '@kogaio'

const Header = ({ user }) =>
  user ? (
    <Space px={4} height='60px'>
      <TopBar bg='gunmetal'>
        <Flex alignItems='center' justifyContent='space-between' width={1}>
          <Touchable effect='opacity' onClick={() => navigate('/')}>
            <Typography
              color='white'
              data-testid='dashboard-title'
              variant='h3'>
              Dashboard
            </Typography>
          </Touchable>
          <UserMenu user={user} />
        </Flex>
      </TopBar>
    </Space>
  ) : null

Header.propTypes = {
  user: PropTypes.object
}

export default Header
