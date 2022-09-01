import React, { useEffect, useState, useMemo } from 'react'
import SimpleMDE from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'

export const BodyInput = (props) => {
  const [value, setValue] = useState('')
  const { hideIcons, maxHeight } = props

  const autofocusNoSpellcheckerOptions = useMemo(() => {
    return {
      spellChecker: false,
      maxHeight: maxHeight || '100px',
      hideIcons: hideIcons,
    }
  }, [])
  useEffect(() => {
    setValue(props.value)
  }, [props.value])
  const onBlur = () => {
    props.onBlur(value, props.question)
  }

  const onChange = (e) => {
    setValue(e)
    props.onChange(value, props.question)
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
