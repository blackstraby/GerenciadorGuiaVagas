import express from 'express';
import Vaga from '../models/vaga';

const router = express.Router();

router.post('/', async (req, res) => {
  const { latitude, longitude, isOcupada } = req.body;

  try {

    let validarVaga = await Vaga.findOne({ latitude, longitude });

    if (validarVaga) {
      const novaVaga = await Vaga.findByIdAndUpdate(validarVaga._id, {
        '$set': {
          latitude, longitude, isOcupada
        }
      })
      return res.status(200).send({ novaVaga })

    } else {
      const vaga = await Vaga.create(req.body);
      vaga.save();
      return res.status(200).send({ vaga })
    }

  } catch (error) {
    console.log(error)
    return res.status(500).send({ erro: "erro cadastrar vaga" })
  }

});


module.exports = app => app.use('/api/vaga', router);
