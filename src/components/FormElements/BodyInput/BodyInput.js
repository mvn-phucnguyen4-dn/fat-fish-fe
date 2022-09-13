import React, { useEffect, useState, useMemo } from 'react'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'

export const BodyInput = (props) => {
  const [value, setValue] = useState('')
  const { hideIcons, maxHeight } = props

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  const autofocusNoSpellcheckerOptions = useMemo(() => {
    return {
      spellChecker: false,
      maxHeight: maxHeight || '100px',
      hideIcons: hideIcons,
      toolbar: [
        'bold',
        'italic',
        'fullscreen',
        'table',
        'code',
        'unordered-list',
        'clean-block',
        'preview',
      ],
    }
  }, [])

  const onChange = (value) => {
    setValue(value)
  }

  const onBlur = () => {
    props.handleChange(value)
  }

  return (
    <SimpleMDE
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      onFocus={onfocus}
      options={autofocusNoSpellcheckerOptions}
    />
  )
}
