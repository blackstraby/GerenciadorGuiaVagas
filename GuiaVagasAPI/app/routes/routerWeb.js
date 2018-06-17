import express from 'express';

import Coordenada from '../models/coordenada';
import parseErrors from '../utils/parseErrors';
import { safeObjectId } from '../utils/db';
import {
  enviarEmailConfirmacao,
  enviarEmailRecuperacaoSenha,
} from '../email/mailer';

import {
  cadastrarCoordenada,
  atualizarCoordenadaById,
  atualizarCoordenada,
} from '../controllers/coordenadaController';

const router = express.Router();

router.route('/cadastrarCoordenada').post(cadastrarCoordenada);
router.route('/atualizarCoordenadaById/:id').post(atualizarCoordenadaById);
router
  .route('/atualizarCoordenada/:lat/:long/:type')
  .post(atualizarCoordenada);

router.post('/cadastrar', async (req, res) => {
  const {
    numero_inscricao,
    cpf,
    email,
    senha,
    celular,
    tokenVoucher,
  } = req.body.user;
  const user = new User({
    dados: { numero_inscricao, cpf, email, senha, celular },
  });
  user.setSenha(senha);
  user.setTokenConfirmacao();

  const voucher = tokenVoucher ? await getVoucherByToken(tokenVoucher) : false;

  if (!voucher && tokenVoucher) {
    res.status(400).json({
      errors: {
        global: 'Voucher inválido ou expirado. Caso não possua, deixe o campo em branco.',
      },
    });
  } else {
    User.findOne({
      'dados.numero_inscricao': user.dados.numero_inscricao,
      'dados.cpf': user.dados.cpf,
      'dados.confirmado': true,
    }).then(candidato => {
      if (candidato) {
        res.status(400).json({
          errors: { global: 'Esse usuário já possuí uma conta ativada.' },
        });
      } else {
        User.findOneAndUpdate(
          {
            'dados.numero_inscricao': user.dados.numero_inscricao,
            'dados.cpf': user.dados.cpf,
          },
          {
            'dados.email': user.dados.email,
            'dados.senha': user.dados.senha,
            'dados.celular': user.dados.celular,
            'dados.confirmado': false,
            'dados.tokenConfirmacao': user.dados.tokenConfirmacao,
            'dados.voucher': voucher ? voucher._id : '',
          },
          { new: true }
        )
          .then(userRecord => {
            if (userRecord) {
              if (voucher) {
                Voucher.findOneAndUpdate(
                  { _id: voucher._id },
                  { status: 'ATIVO' }
                ).then(() => {
                  enviarEmailConfirmacao(userRecord);
                  res.json({ user: userRecord.toAuthJSON() });
                });
              } else {
                enviarEmailConfirmacao(userRecord);
                res.json({ user: userRecord.toAuthJSON() });
              }
            } else {
              res.status(400).json({
                errors: {
                  global: 'Credenciais inválidas para cadastro. Certifique-se de que você é um candidato devidamente cadastrado no TSE.',
                },
              });
            }
          })
          .catch(err => {
            res.status(400).json({
              errors: {
                global: 'Credenciais inválidas para cadastro. Certifique-se de que você é um candidato devidamente cadastrado no TSE.',
              },
            });
          });
      }
    });
  }
});

/*** Login ***/

router.post('/logar/candidato', (req, res) => {
  const { credentials } = req.body;
  User.findOne({
    'dados.email': credentials.email.toUpperCase(),
  }).then(user => {
    if (user && user.isSenhaValida(credentials.senha)) {
      res.json({ user: user.toAuthJSON() });
    } else {
      res.status(400).json({ errors: { global: 'Usuário não encontrado' } });
    }
  });
});

router.post('/login/enviarEmailRecuperacaoSenha', (req, res) => {
  const { credentials } = req.body;
  const candidato = new User({});
  candidato.setTokenRecuperacaoSenha();
  User.findOneAndUpdate(
    {
      'dados.email': credentials.email.toUpperCase(),
    },
    {
      'dados.tokenRecuperacaoSenha': candidato.dados.tokenRecuperacaoSenha,
    },
    { new: true }
  )
    .then(userRecord => {
      enviarEmailRecuperacaoSenha(userRecord);
      res.json({ candidato: userRecord.toAuthJSON() });
    })
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.post('/login/esqueciSenha/candidato/token', (req, res) => {
  const token = req.body.token;
  User.findOne({ 'dados.tokenRecuperacaoSenha': token }).then(candidato => {
    if (candidato) {
      res.json({ candidato: candidato.toAuthJSON() });
    } else {
      res.status(400).json({ errors: { global: 'Token inválido' } });
    }
  });
});

router.post('/login/esqueciSenha/candidato/recuperarSenha', (req, res) => {
  const { credentials } = req.body;
  const candidato = new User({});
  candidato.setSenha(credentials.senha);
  User.findOneAndUpdate(
    {
      'dados.tokenRecuperacaoSenha': credentials.token,
    },
    {
      'dados.senha': candidato.dados.senha,
      'dados.tokenRecuperacaoSenha': '',
    },
    { new: true }
  )
    .then(userRecord => {
      res.json({ candidato: userRecord.toAuthJSON() });
    })
    .catch(err => res.status(400).json({ errors: parseErrors(err.errors) }));
});

router.post('/confirmacao', (req, res) => {
  const token = req.body.token;
  User.findOneAndUpdate(
    { 'dados.tokenConfirmacao': token },
    { 'dados.tokenConfirmacao': '', 'dados.confirmado': true },
    { new: true }
  ).then(user => {
    if (user) {
      res.json({
        user: user.toAuthJSON(),
      });
    } else {
      Anunciante.findOneAndUpdate(
        { 'dados.tokenConfirmacao': token },
        { 'dados.tokenConfirmacao': '', 'dados.confirmado': true },
        { new: true }
      ).then(user => {
        if (user) {
          res.json({
            user: user.toAuthJSON(),
          });
        } else {
          Colaborador.findOneAndUpdate(
            { 'dados.tokenConfirmacao': token },
            { 'dados.tokenConfirmacao': '', 'dados.confirmado': true },
            { new: true }
          ).then(user => {
            if (user) {
              res.json({
                user: user.toAuthJSON(),
              });
            } else {
              res.status(400).json({});
            }
          });
        }
      });
    }
  });
});

router.post('/dashboard', (req, res) => {
  const { credentials, skip, limit } = req.body;
  User.findOne({
    'dados.email': credentials.email.toUpperCase(),
  }).then(user => {
    if (user) {
      Post.find({ candidato_id: user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .then(posts => {
          res.json({ posts: posts });
        });
    } else {
      res.status(400).json({ errors: { global: 'Nenhum post encontrado' } });
    }
  });
});

router.post('/perfil', (req, res) => {
  const { credentials } = req.body;
  User.findOne({
    'dados.email': credentials.email.toUpperCase(),
  }).then(async perfil => {
    if (perfil) {
      perfil.numeroPostsDiario = await Post.getNumeroPostsDiario(perfil);
      res.json({
        perfil: {
          ...perfil._doc,
          numeroPostsDiario: 5 - perfil.numeroPostsDiario,
        },
      });
    } else {
      res.status(400).json({});
    }
  });
});

router.post('/perfil/alterarSenha', (req, res) => {
  const { credentials } = req.body;
  User.findOne({
    'dados.email': credentials.email.toUpperCase(),
  }).then(user => {
    if (user && user.isSenhaValida(credentials.senhaAtual)) {
      user.setSenha(credentials.senha);
      User.findOneAndUpdate(
        {
          'dados.email': user.dados.email,
        },
        {
          'dados.senha': user.dados.senha,
        },
        { new: true }
      )
        .then(userRecord => {
          res.json({ candidato: userRecord.toAuthJSON() });
        })
        .catch(err =>
          res.status(400).json({ errors: parseErrors(err.errors) })
        );
    } else {
      res.status(400).json({ errors: { global: 'Senha incorreta' } });
    }
  });
});

router.get('/postsPorNomeUrna/:nome_urna', (req, res) => {
  const nome_urna = req.params.nome_urna;
  User.findOne({ 'dados.nome_urna': nome_urna.toUpperCase() }).then(user => {
    if (user) {
      Post.find({ candidato_id: user._id })
        .sort({ createdAt: -1 })
        .then(posts => {
          res.json({ candidato: { dados: user, posts: posts } });
        });
    } else {
      res.status(400).json({ errors: { global: 'Candidato não encontrado' } });
    }
  });
});

router.get('/postsPorId/:id', (req, res) => {
  const id = req.params.id;
  User.findOne({ _id: safeObjectId(id) }).then(user => {
    if (user) {
      Post.find({ candidato_id: user._id })
        .sort({ createdAt: -1 })
        .then(posts => {
          res.json({ candidato: { dados: user, posts: posts } });
        });
    } else {
      res.status(400).json({ errors: { global: 'Candidato não encontrado' } });
    }
  });
});

router.post('/alterarStatus/post', (req, res) => {
  const _id = req.body.post._id;
  const isOcupada = req.body.isOcupada;
  Post.findOneAndUpdate(
    { _id: safeObjectId(_id) },
    { isOcupada: isOcupada },
    { new: true }
  ).then(
    post =>
      post
        ? res.json({
          post: post,
        })
        : res.status(400).json({ global: 'publicação não encontrada' })
  );
});

router.get('/postById/:id', (req, res) => {
  const id = req.params.id;
  Post.findOne({ _id: id })
    .then(async post => {
      const usuario = await User.getUsuario(post.candidato_id);
      console.log(usuario);
      if (usuario)
        res.json({
          dados: {
            post: post,
            autor: {
              nome: usuario.dados.nome,
              nome_urna: usuario.dados.nome_urna,
              uf_concorre: usuario.dados.uf_concorre,
              cargo_disputado: usuario.dados.cargo_disputado,
              numero_candidato: usuario.dados.numero_candidato,
              sigla_partido: usuario.dados.sigla_partido,
              sexo: usuario.dados.sexo,
              escolaridade: usuario.dados.escolaridade,
              foto_perfil: usuario.fotoPerfil,
            },
          },
        });
      else
        res
          .status(400)
          .json({ errors: { global: 'Essa postagem não está mais disponível' } });
    })
    .catch(err =>
      res.status(400).json({ errors: { global: 'Postagem não encontrada' } })
    );
});

router.get('/postsPorNomeUsuario/:nome_usuario', (req, res) => {
  const nome_usuario = req.params.nome_usuario;
  User.findOne({
    'dados.nome_usuario': nome_usuario.toLowerCase(),
  }).then(user => {
    if (user) {
      Post.find({ candidato_id: user._id })
        .sort({ createdAt: -1 })
        .then(posts => {
          res.json({ candidato: { dados: user, posts: posts } });
        });
    } else {
      res.status(400).json({ errors: { global: 'Candidato não encontrado' } });
    }
  });
});

router.post('/denunciar/post', (req, res) => {
  const { id } = req.body.post;
  Post.findOne({
    _id: safeObjectId(id),
  }).then(post => {
    const denuncias = post.denuncias === undefined ? 0 : post.denuncias;
    if (post) {
      Post.findOneAndUpdate(
        {
          _id: safeObjectId(id),
        },
        {
          denuncias: parseInt(denuncias) + 1,
        },
        { new: true }
      )
        .then(res.json({ denuncia: { post, data: new Date() } }))
        .catch(err =>
          res.status(400).json({ errors: parseErrors(err.errors) })
        );
    } else {
      res.status(400).json({ errors: { global: 'Post não encontrado' } });
    }
  });
});

export default router;
