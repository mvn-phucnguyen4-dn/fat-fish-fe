import React, { useEffect, useState, useMemo } from 'react'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'
import './BodyInput.css'

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
      onChange={onChange}
      onBlur={onBlur}
      options={autofocusNoSpellcheckerOptions}
    />
  )
}
