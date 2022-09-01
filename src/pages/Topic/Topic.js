import React, { useContext, useEffect, useState } from 'react'
import 'antd/dist/antd.min.css'
import { Col, Row } from 'antd'
import TopicHeader from '../../components/Topic/TopicHeader/TopicHeader'
import TopicBody from '../../components/Topic/TopicBody/TopicBody'
import useHttpClient from '../../hooks/useHttpClient'
import { AuthContext } from '../../context/auth'
import { useParams } from 'react-router-dom'
import { fetchDataApi } from '../../utils/fetchDataApi'
import './Topic.css'

function Quiz() {
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
        <Col
          xs={24}
          sm={18}
          xl={14}
          margintop={'25px'}
          className="margin-topic"
        >
          {data && (
            <>
              <TopicHeader topic={data} />
              <TopicBody sections={data.sections} topic={data} />
            </>
          )}
        </Col>
        <Col xs={0} sm={3} xl={5}></Col>
      </Row>
    </>
  )
}

export default Quiz
