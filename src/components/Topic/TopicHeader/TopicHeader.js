import { QuestionCircleOutlined } from '@ant-design/icons'
import { Tag, Tooltip, Typography, Divider, Row, Col, Switch } from 'antd'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../../../context/auth'
import { fetchDataApi } from '../../../utils/fetchDataApi'
import './TopicHeader.css'

const { Text, Title } = Typography

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

function TopicHeader({ topic, score, scoreId }) {
  const [toggle, setToggle] = useState(false)
  const { currentUser } = useContext(AuthContext)

  const onChange = async (checked) => {
    await fetchDataApi(`topics/${topic.id}`, currentUser.accessToken, 'PUT', {
      releaseScore: checked,
    })
  }

  return (
    <>
      <div className="topic-square"></div>
      <div className="topic-title">
        <div className="topic-title-item">
          <Title level={1}>{topic.title}</Title>
          {score && (
            <p>
              <span className="total">Total points</span>
              <span className="point">
                {score}/{topic.totalScore}
              </span>
              <QuestionCircleOutlined />
            </p>
          )}

          {scoreId && (
            <div className="topic-title-item">
              <p style={{ margin: '0 10px 0 0' }}>Release score: </p>
              <Switch defaultChecked={topic.releaseScore} onChange={onChange} />
            </div>
          )}
        </div>
        <Text>
          {topic.description.length > 600 && toggle === false ? (
            <p>
              {`${topic.description.slice(0, 600)}... `}
              <span
                style={{ cursor: 'pointer', color: '#099bea' }}
                onClick={() => setToggle(true)}
              >
                see more
              </span>
            </p>
          ) : topic.description.length < 600 ? (
            topic.description
          ) : (
            <p>
              {topic.description + ' '}
              <span
                style={{ cursor: 'pointer', color: '#099bea' }}
                onClick={() => setToggle(false)}
              >
                see less
              </span>
            </p>
          )}
        </Text>
        <div className="hashtag">
          <Row>
            <Col span={16}>
              {topic.hashtags.map((tag) => {
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
            </Col>
            <Col span={7}></Col>
          </Row>
        </div>
      </div>
    </>
  )
}

export default TopicHeader
