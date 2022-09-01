import React, { useEffect, useState } from 'react'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'

export const BodyInput = (props) => {
  const [value, setValue] = useState('')
  const { hideIcons, maxHeight } = props

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  const onChange = (value) => {
    setValue(value)
    props.onChange(value)
  }

  return (
    <SimpleMDE
      value={value}
      onChange={onChange}
      options={{ hideIcons: hideIcons, maxHeight: maxHeight || '100px' }}
    />
  )
}
