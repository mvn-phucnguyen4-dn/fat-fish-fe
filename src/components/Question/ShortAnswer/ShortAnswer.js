import { Typography } from 'antd'
import React, { useState } from 'react'
import { BodyInput } from '../../FormElements/BodyInput/BodyInput'
import './ShortAnswer.css'

const { Title } = Typography

function ShortAnswer({ idx, question }) {
  const [value, setValue] = useState('')
  return (
    <>
      <div className="short-answer">
        <Title level={4}>{idx + ', ' + question.title}</Title>
        <BodyInput key="Body" value={value} onChange={() => setValue(value)} />
      </div>
    </>
  )
}

export default ShortAnswer
