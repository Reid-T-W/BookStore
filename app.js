const express = require('express')
const exphbs = require('express-handlebars')
const dotenv = require('dotenv')
const morgan = require('morgan')
const connectDB = require('./config/db')
const path = require('path')
const passport = require('passport')
const session = require('express-session')

//Load Config
dotenv.config({path: './config/config.env'})

//Passport Config
require('./config/passport')(passport)
connectDB()

const app = express()

//Logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

// Handlebars
app.engine('.hbs', exphbs.engine({defaultLayout:'main',extname:'.hbs'}));
app.set('view engine','.hbs');

//Sessions
app.use(session({
    secret:'keyboard cat',
    resave: false,
    saveUninitialized: false
}))


//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())


//Static Folder
app.use(express.static(path.join(__dirname,'public')))

//Routes
app.use('/', require('./routes/index.js'))
app.use('/auth',require('./routes/auth.js'))

const PORT = process.env.PORT || 3000

app.listen(
            PORT,
            console.log(`Server running in ${process.env.NODE_ENV} mode on port${PORT }`)
)