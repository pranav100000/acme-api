require('./instrument')

const config = require('./config')
const { createApp } = require('./app')

const app = createApp()
const port = config.port

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

module.exports = app
