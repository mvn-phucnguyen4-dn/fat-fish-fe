import React, { useState } from 'react'
import { Radio, Space, Typography } from 'antd'
import Modal from './Modal'

const { Title } = Typography
const AnswerKeyModal = (props) => {
  const [value, setValue] = useState('')
  const { question, idx } = props

  const onChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <Modal title="Answer key" show={props.show} onClose={props.onClose}>
      <div className="modal__container" style={{ 'align-items': 'stretch' }}>
        <div className="multi-choice">
          <Title level={3}>{idx + ', ' + question.title}</Title>
          <Radio.Group onChange={onChange} value={value}>
            <Space direction="vertical">
              {question.answers.map((item, index) => (
                <Radio className="btn-radio" key={index} value={item}>
                  {item}
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
