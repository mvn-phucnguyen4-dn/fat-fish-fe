import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import './AfterSubmitAnswer.css'
import { Link, useLocation } from 'react-router-dom'

function AfterSubmitAnswer({}) {
  const [topic, setTopic] = useState({})
  const location = useLocation()
  useEffect(() => {
    setTopic(location.state.topic)
  }, [location])

  return (
    topic && (
      <div className="result-container">
        <span className="title-result">
          Câu trả lời của bạn đã được lưu lại
        </span>
        <Link
          className="btn btn-primary"
          to={`${
            topic.releaseScore
              ? `/topic/${topic.id}/user-answer`
              : `/users/topic`
          }`}
        >
          Xem lại câu trả lời
        </Link>
      </div>
    )
  )
}

export default AfterSubmitAnswer
