import { Col, Row } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import TopicHeader from '../../components/Topic/TopicHeader/TopicHeader'
import UserAnswerBody from '../../components/Topic/UserAnswerBody/UserAnswerBody'
import { AuthContext } from '../../context/auth'
import useHttpClient from '../../hooks/useHttpClient'
import { fetchDataApi } from '../../utils/fetchDataApi'

function UserAnswer() {
  const { setError } = useHttpClient()
  const [data, setData] = useState()
  const { currentUser } = useContext(AuthContext)
  const { topicId } = useParams()

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetchDataApi(
          `topics/${topicId}`,
          currentUser.accessToken,
        )

        response && setData(response.data)
      } catch (error) {
        setError(error.message)
      }
    }
    currentUser && fetchTopics()
  }, [currentUser, topicId])

  return (
    <>
      <Row>
        <Col xs={0} sm={3} xl={5}></Col>
        <Col xs={24} sm={18} xl={14}>
          {data && (
            <>
              <TopicHeader topic={data} />
              <UserAnswerBody sections={data.sections} topicId={topicId} />
            </>
          )}
        </Col>
        <Col xs={0} sm={3} xl={5}></Col>
      </Row>
    </>
  )
}

export default UserAnswer
