import { Radio, Space, Typography } from 'antd'
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
          <Title style={{ 'font-weight': '550', fontSize: '20px' }} level={5}>
            {idx + ', ' + question.title}
          </Title>
          <Radio.Group onChange={onChange} value={value}>
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
        </>
      )}
    </div>
  )
}

export default MultipleChoice
