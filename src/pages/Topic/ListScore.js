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
  const [columns, setColumns] = useState([
    {
      title: 'User',
      key: `User`,
      dataIndex: ['user'],
      fixed: 'left',
      width: 200,
    },
    {
      title: 'Email',
      key: `Email`,
      dataIndex: ['email'],
      width: 200,
    },
    {
      title: 'Sections',
      key: `Sections`,
      children: [],
    },
    {
      title: 'Score',
      key: `Score`,
      dataIndex: ['score'],
      width: 100,
      fixed: 'right',
      sorter: (a, b) => a.score - b.score,
    },
    {
      title: 'Action',
      key: `action`,
      render: (_, record) => (
        <Space size="middle">
          <Link
            to={`/topic/${record.topicId}/mark?scoreId=${record.scoreId}&userId=${record.userId}`}
          >
            Mark
          </Link>
        </Space>
      ),
      width: 100,
      fixed: 'right',
    },
  ])

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
          const scoreBySections = await fetchDataApi(
            `topics/${id}/get-section-score/${item.userId}`,
            currentUser.accessToken,
            'GET',
          )

          const obj = {
            scoreId: item.id,
            userId: item.userId,
            topicId: item.topicId,
            score: item.score,
            topic: topic.data.title,
            user: user.data.username,
            email: user.data.email,
          }
          for (let scoreSection of scoreBySections.data) {
            obj[scoreSection.sectionId] = scoreSection.score
            const sectionCol = columns.find(
              (column) => column.key === 'Sections',
            )
            const isExistCol = sectionCol.children.find(
              (column) => column.key === scoreSection.sectionId,
            )

            if (!isExistCol) {
              setColumns((prev) => {
                const sectionCol = prev.find(
                  (column) => column.key === 'Sections',
                )
                sectionCol.children.push({
                  title: scoreSection.sectionTitle,
                  key: scoreSection.sectionId,
                  dataIndex: [scoreSection.sectionId],
                  width: 100,
                })

                return prev
              })
            }
          }
          setloading(false)
          setData((oldArray) => [...oldArray, obj])
        }
      }
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <>
      <Row>
        <Col xs={2}></Col>
        <Col xs={20}>
          <div className="score-container">
            <h3 className="heading-title">List Score</h3>
            <Table
              columns={columns}
              loading={loading}
              dataSource={data}
              bordered
              rowKey={(state) => state.id}
              size={'middle'}
              scroll={{
                x: 'calc(500px + 50%)',
                y: 240,
              }}
            />
          </div>
        </Col>
        <Col xs={2}></Col>
      </Row>
    </>
  )
}
export default ListScore
