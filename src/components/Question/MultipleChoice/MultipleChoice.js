import { Radio, Space, Typography, Form } from 'antd'
import React, { useEffect, useState } from 'react'
import './MultipleChoice.css'

const { Title } = Typography

function MultipleChoice({
  idx,
  question,
  pushData,
  setPushData,
  topic,
  section,
}) {
  const [value, setValue] = useState([])
  const onChange = (e) => {
    console.log('check require', e.target.rules)
    const answerId = e.target.value
    const answerIndex = pushData.findIndex(
      (item) => item.questionId === question.id,
    )
    if (answerIndex !== -1) {
      pushData[answerIndex].answerId = answerId
      setPushData(pushData)
    } else {
      setPushData((prev) => [
        ...prev,
        {
          topicId: topic,
          sectionId: section,
          questionId: question.id,
          answerId: answerId,
          answerText: null,
        },
      ])
    }
    setValue(answerId)
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
              <Radio.Group onChange={onChange} required value={value}>
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
