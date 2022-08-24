import React, { useEffect, useState } from 'react'
import { Radio, Space, Typography } from 'antd'
import Modal from './Modal'

const { Title } = Typography
const AnswerKeyModal = (props) => {
  const [value, setValue] = useState('')
  const { questionTitle, questionId, answers, changeIsRight } = props

  useEffect(() => {
    const answerRight = answers.find((answer) => answer.isRight)
    if (answerRight) setValue(answerRight.answer)
  }, [answers])

  const onChange = (e, index) => {
    const option = e.target.value
    changeIsRight(option)
    setValue(option)
  }

  return (
    <Modal title="Answer key" show={props.show} onClose={props.onClose}>
      <div className="modal__container" style={{ 'align-items': 'stretch' }}>
        <div className="multi-choice">
          <Title level={3}>{questionId + ', ' + questionTitle}</Title>
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
