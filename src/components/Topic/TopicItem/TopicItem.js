import { EllipsisOutlined } from '@ant-design/icons'
import {
  Avatar,
  Button,
  Col,
  Divider,
  List,
  Popover,
  Row,
  Tag,
  Tooltip,
} from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../../context/auth'
import useHttpClient from '../../../hooks/useHttpClient'
import { fetchDataApi } from '../../../utils/fetchDataApi'
import './TopicItem.css'

const tagColors = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
]

function TopicItem({ item, setRenderData }) {
  const { setError } = useHttpClient()
  const [topicUser, setTopicUser] = useState({})
  const [user, setUser] = useState({})
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    const fetchShareTopics = async () => {
      try {
        const response = await fetchDataApi(
          `users/${item.userId}`,
          currentUser.accessToken,
          'GET',
        )
        response && setTopicUser(response.data)
      } catch (error) {
        setError(error.message)
      }
    }
    currentUser && fetchShareTopics()
  }, [currentUser])

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('userData'))
    if (items) {
      setUser(items)
    }
  }, [])

  const handleDelete = async (id) => {
    try {
      setRenderData((oldData) => oldData.filter((item) => item.id !== id))
      await fetchDataApi(`topics/${id}`, currentUser.accessToken, 'DELETE')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <List.Item
      key={item.id}
      className="topic-item-show"
      style={{ padding: '10px', minHeight: '170px', maxHeight: '170px' }}
    >
      <List.Item.Meta
        style={{ margin: '0' }}
        avatar={<Avatar src={'https://joeschmoe.io/api/v1/random'} />}
        title={
          <div className="topic-item-header">
            <a href="#">{topicUser.username || user.name}</a>
            <Popover
              placement="right"
              content={
                <div className="topic-item-popover">
                  <p
                    onClick={() => {
                      if (window.confirm('Delete the item?')) {
                        handleDelete(item.id)
                      }
                    }}
                  >
                    Delete
                  </p>
                </div>
              }
              trigger="click"
            >
              {item.userId === user.userId && (
                <Button
                  style={{ border: 'none' }}
                  icon={<EllipsisOutlined />}
                  size="small"
                />
              )}
            </Popover>
          </div>
        }
      />
      <div className="test-title">
        <a href={`/topics/${item.id}`}>
          {item.title.length < 20
            ? item.title
            : item.title.slice(0, 20) + '...'}
        </a>
      </div>

      <div className="hashtag">
        <Row>
          <Col span={24}>
            {item.hashtags.slice(0, 3).map((tag) => {
              const isLongTag = tag.title.length > 20
              const tagElem = (
                <Tag
                  key={tag.id}
                  color={
                    tagColors[Math.floor(Math.random() * tagColors.length)]
                  }
                  className="hashtag-item"
                >
                  <span>
                    {isLongTag ? `${tag.title.slice(0, 20)}...` : tag.title}
                  </span>
                </Tag>
              )
              return isLongTag ? (
                <Tooltip title={tag.title} key={tag.id}>
                  {tagElem}
                </Tooltip>
              ) : (
                tagElem
              )
            })}
            {item.hashtags.length > 3 ? '...' : ''}
          </Col>
        </Row>
      </div>
    </List.Item>
  )
}

export default TopicItem
