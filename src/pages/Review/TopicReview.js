import React, { useContext, useEffect, useState } from 'react'
import 'antd/dist/antd.min.css'
import { Col, Row } from 'antd'
import TopicHeader from '../../components/Topic/TopicHeader/TopicHeader'
import TopicBodyReview from '../../components/Topic/TopicReview/TopicReview'
import useHttpClient from '../../hooks/useHttpClient'
import { AuthContext } from '../../context/auth'
import { useParams, useLocation } from 'react-router-dom'
import { fetchDataApi } from '../../utils/fetchDataApi'
import './TopicReview.css'

function TopicReview() {
  const { setError } = useHttpClient()
  const [topic, setTopic] = useState()
  const [userAnswer, setUserAnswer] = useState()
  const { currentUser } = useContext(AuthContext)
  const { topicId } = useParams()
  const { search } = useLocation()
  const url = React.useMemo(() => new URLSearchParams(search), [search])

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userData')).accessToken
    const fetchTopics = async () => {
      try {
        const userId = url.get('userId')
        let topicData
        let userAnswerData
        if (!userId) {
          topicData = await fetchDataApi(
            `topics/${topicId}`,
            token,
            //  currentUser.accessToken,
          )
          userAnswerData = await fetchDataApi(
            `topics/${topicId}/review`,
            token,
            // currentUser.accessToken,
          )
        } else {
          topicData = await fetchDataApi(
            `topics/${topicId}?userId=${userId}`,
            token,
            //  currentUser.accessToken,
          )
          userAnswerData = await fetchDataApi(
            `topics/${topicId}/review?userId=${userId}`,
            token,
            // currentUser.accessToken,
          )
        }
        userAnswerData && setUserAnswer(userAnswerData.data)
        topicData && setTopic(topicData.data)
      } catch (error) {
        setError(error.message)
      }
    }
    fetchTopics()
  }, [currentUser.accessToken, topicId])

  return (
    <>
      <Row>
        <Col xs={0} sm={3} xl={5}></Col>
        <Col xs={24} sm={18} xl={14}>
          {topic && (
            <>
              <TopicHeader topic={topic} score={20} />
              <TopicBodyReview
                sections={topic.sections}
                userAnswers={userAnswer}
              />
            </>
          )}
        </Col>
        <Col xs={0} sm={3} xl={5}></Col>
      </Row>
    </>
  )
}

export default TopicReview