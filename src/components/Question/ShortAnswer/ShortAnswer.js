import { Typography } from 'antd'
import React, { useState } from 'react'
import { BodyInput } from '../../FormElements/BodyInput/BodyInput'
import './ShortAnswer.css'

function ShortAnswer({ idx, question, onChange, onBlur }) {
  const [value, setValue] = useState('')
  return (
    <>
      <div className="short-answer">
        <p style={{ fontSize: '15px', color: 'black' }}>
          {idx + ', ' + question.title}
        </p>
        <BodyInput
          key="Body"
          question={question}
          onBlur={onBlur}
          value={value}
          onChange={onChange}
        />
      </div>
    </>
  )
}

export default ShortAnswer
