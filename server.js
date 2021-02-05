require('dotenv').config();

const express = require('express')
const app = express()

const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTSTRING, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    app.emit('pronto')
  })
  .catch(e => console.log(e));

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// mensagens auto destrutivas, some assim que é lida! São salvas em sessão!
const flash = require('connect-flash');

// qualquer rota dentro do programa
const routes = require('./routes')
// caminhos, trabalha em conjunto com as rotas
const path = require('path');

const helmet = require('helmet');
app.use(helmet());

// helmet e csrf fazem parte da segurança do site, impedem invasões! 

const csrf = require('csurf');
app.use(csrf());

// middlewares: são funções que são executadas nas rotas!
// const meuMiddleware = require('./src/middlewares/middleware')
const { 
  middlewareGlobal,
  outroMiddleware,
  checkCsrfError,
  csrfMiddleware
} = require('./src/middlewares/middleware')

// permite postar formulários dentro da nossa aplicação!
app.use(express.urlencoded({extended: true}))
// pode-se também usar json, para isso é necessário 
// adicionar essa linha de código:
app.use(json());

// arquivo estático, esse acessa a pasta public!
app.use(express.static(path.resolve(__dirname, 'public')));

// configuração de sessão!
const sessionOptions = session({
  secret: 'qwertyuiop´1234567890-=',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});
app.use(sessionOptions);
app.use(flash());

// são os arquivos html da página, esses estão sendo executados com ejs!
app.set('views', path.resolve(__dirname, 'src', 'views'));
// aqui a view engine é a engine que usamos para executar os arquivos ejs!
app.set('view engine', 'ejs');
// ejs é similar ao PHP!


// NOSSOS PRÓPRIOS MIDDLEWAREAS
// app.use(meuMiddleware);
app.use(csrfMiddleware);
app.use(checkCsrfError);
app.use(middlewareGlobal);
app.use(outroMiddleware);
app.use(routes);

// chamando a aplicação depois de conectar com o banco de dados!!
app.on('pronto',() => {
  app.listen(3000, () => {
    console.log('Acessar http://localhost:3000')
    console.log('Servidor executando na porta 3000')
  })
})