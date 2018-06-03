import express, {Router} from 'express';

// Import index action from coordenada controller
import {
  listaCoordenadas,
  getCoordenadaById,
} from '../controllers/coordenadaController';

// Initialize the router
const router = Router ();

router.route ('/coordenadas.json/').get (listaCoordenadas);

router.route ('/coordenadas.json/lista/:pagina').get (listaCoordenadas);

router.route ('/coordenadas.json/id/:id').get (getCoordenadaById);

export default router;
