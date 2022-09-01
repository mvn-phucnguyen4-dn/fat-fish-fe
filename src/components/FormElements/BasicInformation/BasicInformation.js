import React, { useEffect, useState } from 'react'
import './BasicInformation.css'
import TextareaAutosize from 'react-textarea-autosize'
import HashTagInput from '../HashTagInput/HashTagInput'

const BasicInformation = (props) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const { changeTopicTitle, changeTopicDescription } = props

  useEffect(() => {
    setTitle(props.title)
    setDescription(props.description)
  }, [props.title, props.description])

  const changeTitle = (e) => {
    setTitle(e.target.value)
  }

  const changeDescription = (e) => {
    setDescription(e.target.value)
  }

  const blurTitle = () => {
    changeTopicTitle(title)
  }

  const blurDescription = () => {
    changeTopicDescription(description)
  }

  return (
    <>
      <div className="topic-square"></div>
      <div className="basic-informatin">
        <h1>Create a topic</h1>
        <TextareaAutosize
          rows={1}
          className="title-topic"
          value={title}
          autoSize
          onBlur={blurTitle}
          onChange={changeTitle}
        />
        <TextareaAutosize
          className="description-topic"
          autoSize
          value={description}
          onBlur={blurDescription}
          onChange={changeDescription}
        />
        <HashTagInput
          tags={props.hashtags}
          addTag={props.addTag}
          removeTag={props.removeTag}
        />
      </div>
    </>
  )
}

export default BasicInformation
