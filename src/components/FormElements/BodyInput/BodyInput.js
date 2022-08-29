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
      toolbar: [
        'bold',
        'italic',
        'fullscreen',
        'table',
        'code',
        'unordered-list',
        'clean-block',
      ],
    }
  }, [])
  useEffect(() => {
    onBlur()
  }, [value])
  const onfocus = () => {}
  const onBlur = () => {
    const answerIndex = props.pushData.findIndex(
      (item) => item.questionId === props.question.id,
    )
    if (answerIndex !== -1) {
      props.pushData[answerIndex].answerText = value
      props.setPushData(props.pushData)
      setValue(value)
    } else {
      props.setPushData((prev) => [
        ...prev,
        {
          topicId: props.topic,
          sectionId: props.section,
          questionId: props.question.id,
          answerText: value,
          answerId: null,
        },
      ])
    }
  }

  const onChange = (e) => {
    setValue(e)
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
