import { Typography } from 'antd'
import React, { useState } from 'react'
import { BodyInput } from '../../FormElements/BodyInput/BodyInput'
import './ShortAnswer.css'

const { Title } = Typography

function ShortAnswer({ idx, question, setPushData, pushData, topic, section }) {
  return (
    <>
      <div className="short-answer">
        <Title style={{ 'font-weight': '550', fontSize: '20px' }} level={4}>
          {idx + ', ' + question.title}
        </Title>
        <BodyInput
          key="Body"
          pushData={pushData}
          question={question}
          setPushData={setPushData}
          topic={topic}
          section={section}
        />
      </div>
    </>
  )
}

export default ShortAnswer
