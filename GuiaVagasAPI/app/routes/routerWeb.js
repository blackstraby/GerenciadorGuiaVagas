import express from 'express';

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

export default router;
