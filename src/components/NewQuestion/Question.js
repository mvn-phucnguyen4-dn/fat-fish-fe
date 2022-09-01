import React, { useEffect, useState } from 'react'
import { BodyInput } from '../FormElements/BodyInput/BodyInput'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import styles from './Question.module.css'
import { Select, InputNumber, Button } from 'antd'
import AnswerKeyModal from '../Modal/AnswerKeyModel'

const { Option } = Select
const MULTIPLE_CHOICE = 'multi_choice'
const TEXT_ANSWER = 'short_answer'
const MAX_OPTION = 5
const hideIcons = [
  'heading',
  'quote',
  'preview',
  'fullscreen',
  'side-by-side',
  'image',
]

const Question = (props) => {
  const [options, setOptions] = useState(['New option 1'])
  const [showModal, setShowModal] = useState(false)
  const [type, setType] = useState(MULTIPLE_CHOICE)
  const [point, setPoint] = useState(0)
  const [question, setQuestion] = useState({})
  const { removeQuestion, index } = props

  useEffect(() => {
    setQuestion({ ...props.question })
  }, [props.question])
  const changeType = (e) => {
    setType(e)
  }

  const changePoint = (e) => {
    setPoint(e.target.value)
  }

  const changeOption = (e, index) => {
    setOptions((options) => {
      const data = [...options]
      data[index] = e.target.value
      return data
    })
  }

  const changeTitle = (title) => {
    setQuestion((prev) => {
      return { ...prev, title }
    })
  }

  const changeDescription = (description) => {
    setQuestion((prev) => {
      return { ...prev, description }
    })
  }

  const handleRemoveQuestion = () => {
    removeQuestion(index)
  }

  const removeOption = (e, index) => {
    setOptions((options) => options.filter((option, i) => i !== index))
  }

  const addOption = () => {
    if (options.length < 5) setOptions((options) => [...options, 'New option'])
  }

  return (
    <>
      <AnswerKeyModal
        onClose={() => setShowModal(false)}
        show={showModal}
        question={{ title: question.title, answers: options }}
        idx={1}
      ></AnswerKeyModal>
      <div className={`${styles['question-multiple-choice']}`}>
        <BodyInput value={question.title} handleChange={changeTitle} />
        {type === MULTIPLE_CHOICE && (
          <div className={styles['option-wrapper']}>
            <div className={styles['list-option']}>
              {options &&
                options.map((option, index) => (
                  <div className={`${styles['option']}`} key={index}>
                    <input type="radio" className={styles['radio']} />
                    <div className={styles['brise-input']}>
                      <input
                        type="text"
                        name="text"
                        value={options[index]}
                        onChange={(e) => changeOption(e, index)}
                      />
                      <span className={styles.line}></span>
                    </div>
                    {options.length > 1 && (
                      <DeleteOutlined onClick={(e) => removeOption(e, index)} />
                    )}
                  </div>
                ))}
              <Button
                icon={<PlusOutlined />}
                onClick={addOption}
                className={styles['add-option']}
                disabled={options.length === MAX_OPTION}
              />
            </div>
            <div className={styles['answer-description']}>
              <BodyInput
                value={question.description}
                handleChange={changeDescription}
                hideIcons={hideIcons}
              />
            </div>
          </div>
        )}
        <div className={styles['question-footer']}>
          <div className={styles['answer-key']}>
            {type === MULTIPLE_CHOICE && (
              <Button
                color="rgb(24 144 255)"
                onClick={(e) => {
                  setShowModal(true)
                }}
              >
                Answer key
              </Button>
            )}
          </div>
          <div className={styles['action']}>
            <Button
              icon={<DeleteOutlined />}
              className={styles['delete-question']}
              onClick={handleRemoveQuestion}
            />
            <Select style={{ width: 120 }} onChange={changeType} value={type}>
              <Option value="multiple_choice">Multiple choice</Option>
              <Option value="short_answer">Text answer</Option>
            </Select>
            <InputNumber
              min={0.0}
              max={10}
              step={0.5}
              value={point}
              onChange={changePoint}
            ></InputNumber>
          </div>
        </div>
      </div>
    </>
  )
}

export default Question
