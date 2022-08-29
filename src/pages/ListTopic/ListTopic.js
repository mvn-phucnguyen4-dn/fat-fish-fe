import { PlusOutlined } from '@ant-design/icons'
import { Button, Col, List, Pagination, Row, Typography } from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import AddTopicModal from '../../components/Modal/AddTopicModal'
import TopicItem from '../../components/Topic/TopicItem/TopicItem'
import { AuthContext } from '../../context/auth'
import useHttpClient from '../../hooks/useHttpClient'
import { fetchDataApi } from '../../utils/fetchDataApi'
import './ListTopic.css'

function ListTopic() {
  const { setError } = useHttpClient()
  const [myTopic, setMyTopic] = useState({})
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
                sm: 2,
                md: 3,
                lg: 3,
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
                style={{ bottom: '0px' }}
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
