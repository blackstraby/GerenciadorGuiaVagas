import Coordenada from '../models/coordenada';
import {ObjectId} from 'mongodb';

const safeObjectId = s => (ObjectId.isValid (s) ? new ObjectId (s) : null);

export const cadastrarCoordenada = async (req, res, next) => {
  const {latitude, longitude, tipo, status} = req.body;

  try {
    if (await Coordenada.findOne ({latitude, longitude, tipo}))
      return res
        .status (400)
        .send ({error: 'Coordenada já existe no sistema.'});

    const coordenada = await Coordenada.create ({
      latitude,
      longitude,
      tipo,
      status,
    });
    await coordenada.save ();

    return res.send ({coordenada});
  } catch (err) {
    console.log (err);
    return res.status (400).send ({error: 'Error creating new coordinate'});
  }
};

export const atualizarCoordenadaById = async (req, res, next) => {
  try {
    const {latitude, longitude, tipo, status} = req.body;

    const coordenada = await Coordenada.findByIdAndUpdate (
      req.params.id,
      {
        latitude,
        longitude,
        tipo,
        status,
      },
      {new: true}
    );

    await coordenada.save ();
    return res.send ({coordenada});
  } catch (err) {
    return res.status (400).send ({error: 'Error updating coordinate'});
  }
};

export const atualizarCoordenada = async (req, res, next) => {
  try {
    const {latitude, longitude, tipo, status} = req.body;
    const {lat, long, type} = req.params;

    const coordenada = await Coordenada.findOneAndUpdate (
      {
        latitude: lat,
        longitude: long,
        tipo: type,
      },
      {
        latitude,
        longitude,
        tipo,
        status,
      },
      {new: true}
    );

    return res.send ({coordenada});
  } catch (err) {
    return res
      .status (400)
      .send ({error: 'Error updating coordinate lat,long,tipo'});
  }
};

export const listaCoordenadas = async (req, res, next) => {
  let perPage = 50;
  let page = req.params.pagina;

  if (
    req.params.pagina == 0 ||
    req.params.pagina == null ||
    req.params.pagina == undefined
  ) {
    page = 1;
  }

  try {
    const coordenadas = await Coordenada.find ({})
      .sort ({status: -1})
      .skip (perPage * page - perPage)
      .limit (perPage);

    return res.send ({coordenadas});
  } catch (err) {
    return res.status (400).send ({error: 'Error loading coordenadas'});
  }
};

export const getCoordenadaById = async (req, res, next) => {
  try {
    const coordenada = await Coordenada.findById (req.params.id);
    return res.send ({coordenada});
  } catch (err) {
    return res.status (400).send ({error: 'Error loading coordenadas'});
  }
};
