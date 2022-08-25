import { Tag, Tooltip, Typography, Divider, Row, Col } from 'antd'
import React, { useState } from 'react'
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

function TopicHeader({ topic }) {
  const [toggle, setToggle] = useState(false)
  return (
    <>
      <div className="topic-square"></div>
      <div className="topic-title">
        <Title level={1}>{topic.title}</Title>
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
            <Col span={8}></Col>
          </Row>
        </div>
        <Divider>Section</Divider>
      </div>
    </>
  )
}

export default TopicHeader
