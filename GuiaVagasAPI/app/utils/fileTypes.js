import _ from "lodash";

const filtros = {
  imagem: {
    "image/jpeg": "jpeg",
    "image/png": "png",
  },
  fotoPerfil: {
    "image/jpeg": "jpeg",
    "image/png": "png",
  },
  audio: {
    "audio/mp3": "mp3",
    "audio/wav": "wav",
    "audio/x-wav": "wav",
    "audio/ogg": "oga",
    "audio/aac": "aac",
    "audio/vnd.dlna.adts": "aac",
  },
  video: {
    "video/mp4": "mp4",
    "video/x-m4v": "mp4",
    "video/mpeg": "mpeg",
    "video/ogg": "ogv",
    "video/mov": "mov",
    "video/quicktime": "mov"
  }
}

//Refatorar
export const getExtensao = (mimetype) => {
  if (filtros.imagem[mimetype])
    return filtros.imagem[mimetype]
  else if (filtros.fotoPerfil[mimetype])
    return filtros.fotoPerfil[mimetype]
  else if (filtros.audio[mimetype])
    return filtros.audio[mimetype]
  else if (filtros.video[mimetype])
    return filtros.video[mimetype]
}

export const isMimetypePermitido = (tipo, mimetype) => (filtros[tipo] && filtros[tipo][mimetype])