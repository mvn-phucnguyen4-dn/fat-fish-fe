export const getHashtagAPI = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/hashtags`)
    return response.json()
  } catch (error) {
    console.log(error)
  }
}

export const addHashtagAPI = async (tagTitle, iconUrl = '') => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/hashtags`, {
      method: 'POST',
      body: JSON.stringify({
        title: tagTitle,
        iconUrl,
      }),
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
