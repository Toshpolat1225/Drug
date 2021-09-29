const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const csrf = require("csurf")
const flash = require("connect-flash")
const path = require('path')
const mongoose = require("mongoose")
const session = require("express-session")
const MongoStore = require("connect-mongodb-session")(session)
const varMiddleware = require("./middleware/variables")
const userMiddleware = require("./middleware/user")
const compression = require("compression")
const errorHandler = require("./middleware/error")
    // routes
const homeRouter = require('./routes/home')
const addRouter = require('./routes/add')
const drugsRouter = require('./routes/drugs')
const cardRouter = require('./routes/card')
const ordersRouter = require('./routes/orders')
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')
const keys = require("./keys")
    // public ulash jarayoni
app.use(express.static(path.join(__dirname, 'public')))

// post registratsiya
app.use(express.urlencoded({
    extended: true
}))
const store = new MongoStore({
    collection: "sessions",
    uri: keys.MONGODB_URI
})
app.use(session({
    secret: keys.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
}))
app.use(csrf())
app.use(flash())
app.use(compression())
app.use(varMiddleware)
app.use(userMiddleware)
    // hbs ulash jarayoni
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./utils/hbs-helpers'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtomethodsByDefault: true
    }
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')
    // use router
app.use('/', homeRouter)
app.use('/add', addRouter)
app.use('/drugs', drugsRouter)
app.use('/card', cardRouter)
app.use('/orders', ordersRouter)
app.use('/auth', authRouter)
app.use('/profile', profileRouter)

app.get('/contact', (req, res) => {
    res.render('contact', {
        title: 'Contact page',
        isContact: true
    })
})
app.use(errorHandler)
const port = process.env.PORT || 3000;
async function start() {
    try {
        await mongoose.connect(keys.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        app.listen(port, () => {
            console.log(`Express working on ${port} port`);
        })

    } catch (e) {
        console.log(e, "index 54 hato")
    }
}
start()