require('./config')
const express = require('express')
const controllers = require('./controllers')

const app = express()
app.use(express.json())


if(Array.isArray(controllers)) {
    controllers.forEach(item => {
        if(item.name && item.router) {
            app.use(item.name, item.router)
        }
    })
}

app.listen(8989, () => {
    console.log('Server started at PORT:  8989')
})
