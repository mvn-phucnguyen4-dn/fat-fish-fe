import { Radio, Space, Typography, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import './MultipleChoice.css'

function MultipleChoice({ idx, question, onChange }) {
  const [value, setValue] = useState([])
  const onRadio = (e) => {
    setValue(e.target.value)
    onChange(e.target.value, question)
  }
  return (
    <div className="multi-choice">
      {question && (
        <>
          <Form>
            <Form.Item
              rules={[{ required: true, message: 'Please select an option!' }]}
            >
              <p style={{ fontSize: '15px' }}>{idx + ', ' + question.title}</p>
              <Radio.Group onChange={onRadio} required value={value}>
                <Space direction="vertical">
                  {question.answers.map((item, index) => (
                    <Radio
                      className="btn-radio"
                      key={item.id}
                      index={index}
                      value={item.id}
                      checked
                    >
                      {item.answer}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </Form.Item>
          </Form>
        </>
      )}
    </div>
  )
}

export default MultipleChoice
