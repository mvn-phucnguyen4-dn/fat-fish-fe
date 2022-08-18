export const getDataApi = async (url, token) => {
  const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${url}`, {
    method: 'GET',
    body: null,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  return response.json()
}

export const postDataApi = async (url, body, token = '') => {
  const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${url}`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  return response.json()
}

export const putDataApi = async (url, body, token = '') => {
  const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${url}`, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  return response.json()
}
