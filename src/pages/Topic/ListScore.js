import React, { useContext, useEffect, useState } from 'react'
import 'antd/dist/antd.min.css'
import { Col, Row, Space, Table } from 'antd'
import useHttpClient from '../../hooks/useHttpClient'
import { AuthContext } from '../../context/auth'
import { Link, useParams } from 'react-router-dom'
import { fetchDataApi } from '../../utils/fetchDataApi'
import './ListScore.css'
function ListScore() {
  const { setError } = useHttpClient()
  const [data, setData] = useState([])
  const { currentUser } = useContext(AuthContext)
  const { id } = useParams()
  const [loading, setloading] = useState(true)

  useEffect(async () => {
    currentUser && fetchData()
  }, [currentUser, id])
  const fetchData = async () => {
    try {
      const response = await fetchDataApi(
        `topics/${id}/scores`,
        currentUser.accessToken,
        'GET',
      )
      setloading(false)
      if (response) {
        for (const item of response.data) {
          const user = await fetchDataApi(
            `users/${item.userId}`,
            currentUser.accessToken,
            'GET',
          )
          const topic = await fetchDataApi(
            `topics/${item.topicId}`,
            currentUser.accessToken,
            'GET',
          )
          setData((oldArray) => [
            ...oldArray,
            {
              score: item.score,
              userId: item.userId,
              topicId: item.topicId,
              topic: topic.data.title,
              user: user.data.username,
              email: user.data.email,
            },
          ])
        }
      }
    } catch (error) {
      setError(error.message)
    }
  }
  const columns = [
    {
      title: 'Topic',
      key: `Topic`,
      dataIndex: ['topic'],
    },
    {
      title: 'Score',
      key: `Score`,
      dataIndex: ['score'],
    },
    {
      title: 'User',
      key: `User`,
      dataIndex: ['user'],
    },
    {
      title: 'Email',
      key: `Email`,
      dataIndex: ['email'],
    },
    {
      title: 'Action',
      key: `action`,
      render: (_, record) => (
        <Space size="middle">
          <Link
            to={`/topic/${record.topicId}/mark?score=${record.score}&userId=${record.userId}`}
          >
            Mark
          </Link>
        </Space>
      ),
    },
  ]
  return (
    <>
      <Row>
        <Col xs={2}></Col>
        <Col xs={20}>
          <div className="topic-container">
            <h3 className="heading-title">List Score</h3>
            <Table
              className="table-score"
              columns={columns}
              loading={loading}
              dataSource={data}
              rowKey={(state) => state.id}
              size={'middle'}
            />
          </div>
        </Col>
        <Col xs={2}></Col>
      </Row>
    </>
  )
}
export default ListScore
