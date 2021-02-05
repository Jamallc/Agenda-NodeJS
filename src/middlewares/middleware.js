// module.exports = (req, res, next) => {
//   if(req.body.cliente) {
//     req.body.cliente = req.body.cliente.replace('Rocha', 'Não use ROCHA') 
//     console.log()
//     console.log(`Vi que você postou ${req.body.cliente}`)
//     console.log()
//   }
//   next();
// };

exports.middlewareGlobal = (req, res, next) => {
  res.locals.ummaVarialvelLocal = 'Este é o valor da variável Loocal!'
  next();
};

exports.outroMiddleware = (req, res, next) => {
  next();
};

exports.checkCsrfError = (err, req, res, next) => {
  if(err && err.code === 'EBADCSRFTOKEN') {
    return res.render('404');
  }
}

exports.csrfMiddleware = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next()
}