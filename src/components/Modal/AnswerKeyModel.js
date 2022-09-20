import React, { useEffect, useState } from 'react'
import { Radio, Space, Typography } from 'antd'
import Modal from './Modal'
import hljs from 'highlight.js'
import 'highlight.js/styles/a11y-dark.css'

const { Title } = Typography
const AnswerKeyModal = (props) => {
  const [value, setValue] = useState('')
  const { questionTitle, questionId, answers, changeIsRight } = props

  useEffect(() => {
    updateCodeSyntaxHighlighting()
    const answerRight = answers.find((answer) => answer.isRight)
    if (answerRight) setValue(answerRight.answer)
  }, [answers])

  const updateCodeSyntaxHighlighting = () => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block)
    })
  }

  const onChange = (e, index) => {
    const option = e.target.value
    changeIsRight(option)
    setValue(option)
  }

  return (
    <Modal title="Answer key" show={props.show} onClose={props.onClose}>
      <div
        className="modal__container"
        style={{ 'align-items': 'stretch', overflow: 'auto', height: '400px' }}
      >
        <div className="multi-choice">
          <div
            className="mardown-output"
            dangerouslySetInnerHTML={{
              __html: questionTitle,
            }}
          ></div>
          <Radio.Group onChange={onChange} value={value}>
            <Space direction="vertical">
              {answers.map((answer, index) => (
                <Radio className="btn-radio" key={index} value={answer.answer}>
                  {answer.answer}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </div>
      </div>
    </Modal>
  )
}

export default AnswerKeyModal
