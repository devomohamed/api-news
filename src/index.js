const express = require('express')
const reporterRouter = require('./routers/reporter')
const news = require('./routers/news')

require('./db/mongoose')
const app = express()
port = process.env.PORT || 3000

app.use(express.json())
app.use(reporterRouter)
app.use(news)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})