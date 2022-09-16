import React, { useEffect, useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-custom-build/build/ckeditor'
import { minioClient } from '../../../utils/minioConfig'
import { toast } from 'react-toastify'
import { toastOptionError } from '../../../utils/toastOption'
import './BodyInput.css'

export const BodyInput = (props) => {
  const [value, setValue] = useState(props.value)

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  const editorConfiguration = {
    extraPlugins: [uploadPlugin],
    toolbar: [
      'heading',
      '|',
      'bold',
      'italic',
      'link',
      'bulletedList',
      'numberedList',
      '|',
      'outdent',
      'indent',
      '|',
      'uploadImage',
      'blockQuote',
      'insertTable',
      'mediaEmbed',
      'undo',
      'redo',
      '|',
      'codeBlock',
    ],
  }

  const onChange = (event, editor) => {
    const value = editor.getData()
    setValue(value)
  }

  const onBlur = (event, editor) => {
    props.handleChange(value)
  }

  const upImageMinIO = async (file, fileName) => {
    try {
      const url = await minioClient.presignedPutObject(
        process.env.REACT_APP_MINIO_BUCKET,
        fileName,
      )
      const image = await fetch(url, {
        method: 'PUT',
        body: file,
      })
    } catch (error) {
      toast.error('Upload image faild', toastOptionError)
    }
  }

  const uploadAdapter = (loader) => {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          let fileName
          loader.file
            .then(async (file) => {
              fileName = Date.now().toString() + file.name
              return upImageMinIO(file, fileName)
            })
            .then(() =>
              minioClient.presignedGetObject(
                process.env.REACT_APP_MINIO_BUCKET,
                fileName,
              ),
            )
            .then((url) => resolve({ default: url }))
            .catch((err) => {
              toast.error('Upload image faild', toastOptionError)
              reject(err)
            })
        })
      },
    }
  }

  function uploadPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return uploadAdapter(loader)
    }
  }

  return (
    <div className="mark-down">
      <CKEditor
        editor={Editor}
        data={value}
        onBlur={onBlur}
        onChange={onChange}
        config={editorConfiguration}
      />
    </div>
  )
}
