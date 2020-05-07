import Redis from 'ioredis'

const redis = new Redis({
  port: 6379, // Redis port
  host: 'localhost', // Redis host
  family: 4, // 4 (IPv4) or 6 (IPv6)
  password: ''
})

export default redis
