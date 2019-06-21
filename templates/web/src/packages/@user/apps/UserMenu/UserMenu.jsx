import React, { useState, useCallback } from 'react'
import PropTypes from 'prop-types'

import { MenuList, Touchable, Typography } from '@kogaio'
import { ConfirmModal } from './components'

const menuItems = [
  {
    id: 'my-account',
    name: 'My Profile'
  },
  {
    id: 'signout-button',
    name: 'Sign Out'
  }
]

export const UserMenu = ({ user }) => {
  const [isModalShown, setModalShown] = useState(false)

  const hideModal = () => setModalShown(false)
  const toggleModal = () => setModalShown(prevState => !prevState)

  const _selectMenuItem = item => {
    switch (item) {
      case 'My Profile':
        return console.warn('* My Account fired. Feature still in progress.')
      case 'Sign Out':
        toggleModal()
        break
      default:
        break
    }
  }

  const Avatar = useCallback(
    ({ ...props }) => {
      const {
        name: firstName = 'A',
        family_name: lastName = 'A'
      } = user.attributes
      const initials = (() => {
        const initials = `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`
        return initials
      })()
      return (
        <Touchable
          effect='opacity'
          bg='dark-gunmetal'
          borderRadius='round'
          data-testid='user-menu-toggler'
          p={3}
          my={3}
          {...props}>
          <Typography color='white' fontSize={3} variant='h5'>
            {initials}
          </Typography>
        </Touchable>
      )
    },
    [user.attributes]
  )

  return (
    <>
      <MenuList
        alignment='right'
        arrowSize={8}
        CustomToggler={Avatar}
        id='user-menu'
        listItems={menuItems}
        onSelectItem={_selectMenuItem}
      />
      <ConfirmModal hideModal={hideModal} visible={isModalShown} />
    </>
  )
}

UserMenu.propTypes = {
  user: PropTypes.object.isRequired
}

export default UserMenu
