import * as minio from 'minio'

export const minioClient = new minio.Client({
  endPoint: process.env.REACT_APP_MINIO_END_POINT,
  port: parseInt(process.env.REACT_APP_MINIO_PORT),
  useSSL: false,
  accessKey: process.env.REACT_APP_MINIO_ACCESS_KEY,
  secretKey: process.env.REACT_APP_MINIO_SECRET_KEY,
})
