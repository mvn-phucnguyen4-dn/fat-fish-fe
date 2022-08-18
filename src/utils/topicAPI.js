export const getTopicByIdAPI = async (topicId, token) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/topics/${topicId}`,
      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return response.json()
  } catch (error) {
    console.log(error)
  }
}

export const updateTopicAPI = async (topic, token) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/topics`, {
      method: 'PUT',
      body: JSON.stringify(topic),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.json()
  } catch (error) {
    console.log(error)
  }
}

export const addTopicAPI = async (topic, token) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/topics`, {
      method: 'POST',
      body: JSON.stringify(topic),
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    return response.json()
  } catch (error) {
    console.log(error)
  }
}
