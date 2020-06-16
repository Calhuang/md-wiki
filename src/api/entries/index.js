const axios = require('axios')

const instance = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 5000,
})

export const getEntryHistory = async (id) => {
  const res = await instance.get(`/entry/history/${id}`)
  return res.data
}

export const getEntry = async (id) => {
  const res = await instance.get(`/entry/${id}`)
  return res.data
}

export const postEntry = async (obj) => {
  const res = await instance.post('/entry', obj)
  return res.data
}

export const putEntry = async (id, obj) => {
  const res = await instance.put(`/entry/${id}`, obj)
  return res.data
}

export const searchEntry = async (term) => {
  const res = await instance.get(`/entry/search/${term}`)
  return res.data
}
