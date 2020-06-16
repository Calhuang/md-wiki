const axios = require('axios')

const instance = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 5000,
})

export const getImage = async (id) => {
  const res = await instance.get(`/images/${id}`)
  return res.data
}

export const postImage = async (formData) => {
  const res = await instance.post('/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return res.data
}
