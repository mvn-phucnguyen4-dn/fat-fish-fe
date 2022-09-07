import React, { useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import HashTagInput from '../HashTagInput/HashTagInput'
import { Switch } from 'antd'
import styles from './BasicInformation.module.css'
import UserInput from '../UserInput/UserInput'

const BasicInformation = (props) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const {
    changeTopicTitle,
    changeTopicDescription,
    isPrivate,
    changeTopicIsPrivate,
    changeTopicReleaseScore,
    releaseScore,
    users,
  } = props

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

  const changeIsPrivate = (isPrivate) => {
    changeTopicIsPrivate(isPrivate)
  }

  const changeReleaseScore = (releaseScore) => {
    changeTopicReleaseScore(releaseScore)
  }

  return (
    <>
      <div className={styles['topic-square']}></div>
      <div className={styles['basic-informatin']}>
        <div className={styles['head-topic']}>
          <h1>Create a topic</h1>
          <div className={styles['head-topic-action']}>
            <p>
              Set private for topic:
              <Switch checked={isPrivate} onChange={changeIsPrivate} />
            </p>
            <p>
              Set release score for topic:
              <Switch checked={releaseScore} onChange={changeReleaseScore} />
            </p>
          </div>
        </div>
        <div className={styles['brise-input']}>
          <TextareaAutosize
            rows={1}
            className={styles['title-topic']}
            value={title}
            autoSize
            onBlur={blurTitle}
            onChange={changeTitle}
          />
          <span className={styles.line}></span>
        </div>

        <div className={styles['brise-input']}>
          <TextareaAutosize
            className="description-topic"
            autoSize
            value={description}
            onBlur={blurDescription}
            onChange={changeDescription}
          />
          <span className={styles.line}></span>
        </div>
        <HashTagInput
          tags={props.hashtags}
          addTag={props.addTag}
          removeTag={props.removeTag}
        />
        <UserInput
          users={users}
          addUser={props.addUser}
          removeUser={props.removeUser}
          userId={props.userId}
        />
      </div>
    </>
  )
}

export default BasicInformation
