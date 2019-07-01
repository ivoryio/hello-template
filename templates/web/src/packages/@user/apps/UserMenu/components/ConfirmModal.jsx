import React from 'react'
import PropTypes from 'prop-types'
import { Button, Flex, Modal, Space, Typography } from '@ivoryio/kogaio'

import api from '@user/services/user.dataservice'

const ConfirmModal = ({ hideModal, visible }) => {
  async function _signOut () {
    try {
      await api.signOut()
      hideModal()
    } catch (err) {
      return console.error('* Error caught on sign out', err)
    }
  }

  return (
    <Modal
      alignItems='center'
      justifyContent='center'
      hide={hideModal}
      onBackdropClick={hideModal}
      visible={visible}>
      <Space p={16}>
        <Flex
          alignItems='center'
          bg='white'
          flexDirection='column'
          justifyContent='center'>
          <Typography variant='h4'>
            Are you sure you want to sign out?
          </Typography>
          <Space mt={4}>
            <Flex>
              <Space mx={1}>
                <Button
                  variant='outline'
                  title='No, take me back'
                  onClick={hideModal}
                />
                <Button
                  variant='primary'
                  title='Yes, sign out'
                  onClick={_signOut}
                />
              </Space>
            </Flex>
          </Space>
        </Flex>
      </Space>
    </Modal>
  )
}

ConfirmModal.propTypes = {
  hideModal: PropTypes.func,
  visible: PropTypes.bool
}

export default ConfirmModal
