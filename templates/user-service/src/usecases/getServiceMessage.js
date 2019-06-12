module.exports = retrieveMessage => async () => {
  try {
    const message = await retrieveMessage()
    return {
        ...message,
        timestamp: Date()
    }
  } catch (err) {
    throw err
  }
}
