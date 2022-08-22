export const fetchDataApi = async (url, token, method, body) => {
  const response = await fetch(`${process.env.REACT_APP_BASE_URL}/${url}`, {
    method: method,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  return response.json()
}
