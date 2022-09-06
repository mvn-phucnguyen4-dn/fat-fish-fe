import React, { useContext, useEffect, useState } from 'react'
import 'antd/dist/antd.min.css'
import { Col, Row } from 'antd'
import TopicHeader from '../../components/Topic/TopicHeader/TopicHeader'
import useHttpClient from '../../hooks/useHttpClient'
import { AuthContext } from '../../context/auth'
import { useLocation, useParams } from 'react-router-dom'
import { fetchDataApi } from '../../utils/fetchDataApi'
import './MarkScore.css'
import TopicRemark from '../../components/Topic/TopicRemark/TopicRemark'

function useQuery() {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}

function MarkScore() {
  const { setError } = useHttpClient()
  const [topic, setTopic] = useState()
  const [userAnswer, setUserAnswer] = useState()
  const { currentUser } = useContext(AuthContext)
  const { topicId } = useParams()
  let query = useQuery()

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userData')).accessToken
    const fetchTopics = async () => {
      try {
        const topicData = await fetchDataApi(
          `topics/${topicId}`,
          token,
          //  currentUser.accessToken,
        )
        const userAnswerData = await fetchDataApi(
          `topics/${topicId}/review?userId=${query.get('userId')}`,
          token,
          // currentUser.accessToken,
        )
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
              <TopicHeader topic={topic} scoreId={query.get('scoreId')} />
              <TopicRemark
                topic={topic}
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

export default MarkScore
