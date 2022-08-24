import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, List, Row, Typography } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import AddTopicModal from '../../components/Modal/AddTopicModal'
import TopicItem from '../../components/Topic/TopicItem/TopicItem'
import { AuthContext } from '../../context/auth'
import useHttpClient from '../../hooks/useHttpClient'
import { fetchDataApi } from '../../utils/fetchDataApi'
import './ListTopic.css'

function ListTopic() {
  const { setError } = useHttpClient()
  const [myTopic, setMyTopic] = useState([])
  const [shareTopic, setShareTopic] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetchDataApi(
          `topics/my-topic`,
          currentUser.accessToken,
          'GET',
        )
        response && setMyTopic(response.data)
      } catch (error) {
        setError(error.message)
      }
    }
    currentUser && fetchTopics()
  }, [currentUser])

  useEffect(() => {
    const fetchShareTopics = async () => {
      try {
        const response = await fetchDataApi(
          `topics/share`,
          currentUser.accessToken,
          'GET',
        )
        response && setShareTopic(response.data.topics)
      } catch (error) {
        setError(error.message)
      }
    }
    currentUser && fetchShareTopics()
  }, [currentUser])
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
                sm: 2,
                md: 3,
                lg: 3,
                xl: 3,
                xxl: 3,
              }}
              pagination={{
                onChange: (page) => {
                  console.log(page)
                },
                pageSize: 6,
              }}
              dataSource={myTopic}
              renderItem={(item) => (
                <TopicItem item={item} setMyTopic={setMyTopic} />
              )}
            />

            <List
              header={
                <Typography.Title level={2}>Share topic</Typography.Title>
              }
              itemLayout="vertical"
              size="large"
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 3,
                lg: 3,
                xl: 3,
                xxl: 3,
              }}
              pagination={{
                onChange: (page) => {
                  console.log(page)
                },
                pageSize: 6,
              }}
              dataSource={shareTopic}
              renderItem={(item) => <TopicItem item={item} />}
            />
          </div>
        </Col>
        <Col xs={2}></Col>
      </Row>
      <AddTopicModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        setMyTopic={setMyTopic}
      />
    </>
  )
}

export default ListTopic
