import nodemailer from 'nodemailer';

const from = '"Guia Vagas" <info@guiavagas.com.br>';

function configuracao () {
  return nodemailer.createTransport ({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export function enviarEmailConfirmacao (user) {
  const transport = configuracao ();
  const email = {
    from,
    to: user.dados.email,
    subject: 'Bem-vindo ao Guia Vagas',
    text: `
      Bem-vindo ao Guia Vagas. Por favor, confirme seu email.

      ${user.gerarUrlConfirmacao ()}`,
  };

  transport
    .sendMail (email)
    .then (() => {
      return 'Email enviado';
    })
    .catch (error => {
      res.send (error);
    });
}

export function enviarEmailRecuperacaoSenha (user) {
  const transport = configuracao ();
  const email = {
    from,
    to: user.dados.email,
    subject: 'Recuperação de Senha - Guia Vagas',
    text: `
      Olá Candidato ${user.dados.nome},
      
      Recebemos uma solicitação para redefinir sua senha do Guia Vagas.

      Acesse o link abaixo para redefinir sua senha:

      ${user.gerarUrlRecuperacaoSenha ()}`,
  };

  transport.sendMail (email).then (res.status (200)).catch (error => {
    res.send (error);
  });
}
