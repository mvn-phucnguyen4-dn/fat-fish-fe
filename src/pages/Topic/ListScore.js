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
  const { id } = useParams()

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        console.log('check topic', id)
        const response = await fetchDataApi(
          `topics/${id}/scores`,
          currentUser.accessToken,
          'GET',
        )
        console.log(response.data)
        response && setData(response.data)
      } catch (error) {
        setError(error.message)
      }
    }
    currentUser && fetchTopics()
  }, [currentUser, id])

  return (
    <>
      <Row>
        <Col xs={0} sm={3} xl={5}></Col>
        <Col xs={24} sm={18} xl={14}>
          {data && <></>}
        </Col>
        <Col xs={0} sm={3} xl={5}></Col>
      </Row>
    </>
  )
}

export default Quiz
