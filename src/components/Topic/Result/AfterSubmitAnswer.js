import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import './AfterSubmitAnswer.css'
import { useLocation } from 'react-router-dom'

function AfterSubmitAnswer({}) {
  const [title, setTitle] = useState('')
  const location = useLocation()
  useEffect(() => {
    setTitle(location.state.topic)
  }, [location])
  return (
    title && (
      <div className="result-container">
        <span className="title-result">
          Câu trả lời của bạn đã được lưu lại
        </span>
        <Button className="btn btn-primary" size={'large'}>
          Xem lại câu trả lời
        </Button>
      </div>
    )
  )
}

export default AfterSubmitAnswer
