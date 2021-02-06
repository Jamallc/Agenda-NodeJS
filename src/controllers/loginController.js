const Login = require('../models/LoginModel')

exports.index = (req, res) => {
  res.render('login')
}

exports.register = async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.register();
  
    if(login.erros.length > 0) {
      req.flash('erros', login.erros);
      req.session.save(function(){
        return res.redirect('/login');
      });
      return;
    }
    req.flash('success', 'Seu usuário foi criado com sucesso!');
    req.session.save(function(){
      return res.redirect('/login');
    });
  }catch(e){
    console.log(e)
    return res.render('404')
  }

} 