import React, { useState } from 'react'
import Question from '../NewQuestion/Question'
import TextareaAutosize from 'react-textarea-autosize'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import './Section.css'

const Section = (props) => {
  const [questions, setQuestions] = useState([
    { id: 1, title: 'Question title', description: 'Question description' },
  ])
  const { changeSection, section, index } = props

  const addQuestion = () => {
    setQuestions((questions) => [...questions, 'Question'])
  }

  const removeQuestion = (id) => {
    setQuestions((question) =>
      question.filter((question, index) => id != index),
    )
  }

  return (
    <div className="section">
      <TextareaAutosize
        key={index}
        rows={1}
        className="title-topic"
        autoSize
        value={section.title}
        onChange={(e) => changeSection(e, index)}
      />
      {questions &&
        questions.map((question, index) => (
          <Question
            key={index}
            removeQuestion={removeQuestion}
            index={index}
            question={question}
          />
        ))}
      <Button
        icon={<PlusOutlined />}
        className="add-question"
        onClick={addQuestion}
      />
    </div>
  )
}

export default Section
