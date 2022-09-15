import React, { useEffect, useState } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import Editor from 'ckeditor5-custom-build/build/ckeditor'
import './BodyInput.css'

export const BodyInput = (props) => {
  const [value, setValue] = useState(props.value)

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  const editorConfiguration = {
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
