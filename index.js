require('./config')
const models = require('./db/models/indexWithComments')
const express = require('express')
const controllers = require('./controllers')

const app = express()
app.use(express.json())

const router = express.Router()



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
