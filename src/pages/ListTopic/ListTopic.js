import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, List, Pagination, Row, Skeleton, Typography } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AddTopicModal from '../../components/Modal/AddTopicModal'
import TopicItem from '../../components/Topic/TopicItem/TopicItem'
import { AuthContext } from '../../context/auth'
import useHttpClient from '../../hooks/useHttpClient'
import { fetchDataApi } from '../../utils/fetchDataApi'
import './ListTopic.css'

function ListTopic() {
  const { setError } = useHttpClient()
  const [myTopic, setMyTopic] = useState({})
  const [scores, setScores] = useState([])
  const [renderData, setRenderData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { currentUser } = useContext(AuthContext)
  const TOPIC_SIZE = 6

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetchDataApi(
          `topics/my-topic?size=${TOPIC_SIZE}`,
          currentUser.accessToken,
          'GET',
        )
        setMyTopic(response)
        setRenderData(response.data)
      } catch (error) {
        setError(error.message)
      }
    }
    fetchTopics()
  }, [currentUser.accessToken])

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetchDataApi(
          `scores`,
          currentUser.accessToken,
          'GET',
        )
        await console.log(response)
        setScores(response)
      } catch (error) {
        setError(error.message)
      }
    }
    fetchTopics()
  }, [currentUser.accessToken])

  const handlePagination = async (page) => {
    const response = await fetchDataApi(
      `topics/my-topic?page=${page}&size=${TOPIC_SIZE}`,
      currentUser.accessToken,
      'GET',
    )
    setMyTopic(response)
    setRenderData(response.data)
  }

  return (
    <>
      <Row>
        <Col xs={2}></Col>
        <Col xs={20}>
          <div className="topic-container">
            <List
              header={
                <div className="topic-header">
                  <Typography.Title level={2}>Your topic</Typography.Title>
                  <Button
                    shape="circle"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={() => setIsModalVisible(true)}
                  />
                </div>
              }
              itemLayout="vertical"
              size="large"
              grid={{
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 2,
                xl: 3,
                xxl: 3,
              }}
              dataSource={renderData}
              renderItem={(item) => (
                <TopicItem item={item} setRenderData={setRenderData} />
              )}
            />
            {myTopic.meta && (
              <Pagination
                pageSize={myTopic.meta.limit}
                current={myTopic.meta.page}
                total={myTopic.meta.total}
                onChange={handlePagination}
                size="default"
                style={{
                  bottom: '0px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              />
            )}
            <List
              header={
                <div className="topic-header">
                  <Typography.Title level={2}>My Topic result</Typography.Title>
                </div>
              }
              itemLayout="horizontal"
              size="large"
              dataSource={scores.data}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Link
                      key={item.id}
                      to={`/topics/${item.topicId}/review?score=${item.score}`}
                    >
                      Watch detail
                    </Link>,
                  ]}
                >
                  <List.Item.Meta
                    title={<p>{item.topic?.title}</p>}
                    description={
                      item.topic?.description.length > 100
                        ? item.topic?.description.slice(0, 100)
                        : item.topic?.description
                    }
                  />
                  <div>score: {item.score}</div>
                </List.Item>
              )}
            />
            {scores.meta && (
              <Pagination
                pageSize={scores.meta.limit}
                current={scores.meta.page}
                total={scores.meta.total}
                onChange={handlePagination}
                size="default"
                style={{
                  bottom: '0px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              />
            )}
          </div>
        </Col>
        <Col xs={2}></Col>
      </Row>
      <AddTopicModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        setRenderData={setRenderData}
      />
    </>
  )
}

export default ListTopic
