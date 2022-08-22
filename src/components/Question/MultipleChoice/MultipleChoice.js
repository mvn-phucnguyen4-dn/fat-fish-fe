import { Radio, Space, Typography } from 'antd'
import React, { useState } from 'react'
import './MultipleChoice.css'

const { Title } = Typography

function MultipleChoice({ idx, question }) {
  const [value, setValue] = useState('')
  const onChange = (e) => {
    setValue(e.target.value)
  }

  return (
    <div className="multi-choice">
      {question && (
        <>
          <Title level={4}>{idx + ', ' + question.title}</Title>
          <Radio.Group onChange={onChange} value={value}>
            <Space direction="vertical">
              {question.answers.map((item) => (
                <Radio className="btn-radio" key={item.id} value={item.answer}>
                  {item.answer}
                </Radio>
              ))}
            </Space>
          </Radio.Group>
        </>
      )}
    </div>
  )
}

export default MultipleChoice
