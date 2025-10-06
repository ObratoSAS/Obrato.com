import axios from 'axios'

// Cliente Axios configurado para apuntar al backend de .NET.
export const api = axios.create({
  baseURL: '/api'
})
