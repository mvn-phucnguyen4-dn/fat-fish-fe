import React, { useContext, useEffect, useState } from 'react'
import 'antd/dist/antd.min.css'
import { Col, Row } from 'antd'
import TopicHeader from '../../components/Topic/TopicHeader/TopicHeader'
import TopicBody from '../../components/Topic/TopicBody/TopicBody'
import useHttpClient from '../../hooks/useHttpClient'
import { AuthContext } from '../../context/auth'
import { useHistory, useParams } from 'react-router-dom'
import { fetchDataApi } from '../../utils/fetchDataApi'
import './Topic.css'
import ErrorModal from '../../components/Modal/ErrorModal'

function Quiz() {
  const { setError, clearError, error } = useHttpClient()
  const [data, setData] = useState()
  const { currentUser } = useContext(AuthContext)
  const { topicId } = useParams()
  const history = useHistory()

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetchDataApi(
          `topics/${topicId}`,
          currentUser.accessToken,
        )
        if (response.meta.submit_flag) {
          setError('Opp! You have done this topic!!')
          setTimeout(() => {
            history.push({
              pathname: '/result',
              state: { topic: response.data },
            })
          }, 3000)
        } else setData(response.data)
      } catch (error) {
        setError(error.message)
      }
    }
    currentUser && fetchTopics()
  }, [currentUser, topicId])

  return (
    <>
      <ErrorModal error={error} onClose={clearError} />
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
