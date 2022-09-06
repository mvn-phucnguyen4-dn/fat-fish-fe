import { CloseOutlined, CheckOutlined } from '@ant-design/icons/lib/icons'
import { Typography, Input } from 'antd'
import React, { useState } from 'react'
import { BodyInput } from '../../FormElements/BodyInput/BodyInput'
import './ShortAnswer.css'

const { TextArea } = Input
const { Title } = Typography

function ShortAnswer({ idx, question, userAnswer }) {
  const [value, setValue] = useState('')
  return (
    <>
      {userAnswer ? (
        <div className="short-answer">
          <Title
            className={`${userAnswer.isRight ? 'correct' : 'incorrect'}`}
            level={4}
          >
            <p>
              {userAnswer.isRight ? <CheckOutlined /> : <CloseOutlined />}
              {'   '}
              {question.title}
            </p>
          </Title>
          <TextArea
            className="short-answer-input"
            type="text"
            value={userAnswer.answerText}
            readOnly
            autoSize
          ></TextArea>
          {!userAnswer.isRight && (
            <>
              <p style={{ marginTop: '10px', color: 'black' }}>
                <b>Description : </b> <span>{question.description}</span>
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="short-answer">
          <Title level={4}>{idx + '. ' + question.title}</Title>
          <BodyInput
            key="Body"
            value={value}
            onChange={() => setValue(value)}
          />
        </div>
      )}
    </>
  )
}

export default ShortAnswer
