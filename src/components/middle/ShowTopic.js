import React, { useEffect, useState, useRef } from 'react'
import './ShowTopic.css'
import { ranColor, changeDate } from '../../utils/commonFunc'
import { Card, Tag } from 'antd'
import { NavLink } from 'react-router-dom'
import { fetchDataApi } from '../../utils/fetchDataApi'

const ShowTopic = () => {
  const [topics, setTopics] = useState([])

  const fetchTopics = async () => {
    try {
      const limit = 10
      const responseData = await fetchDataApi(`topics`)
      if (responseData) {
        setTopics([...topics, ...responseData.data])
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchTopics()
  }, [])
  return (
    <>
      <div className="container-topic">
        {topics &&
          topics.map((item, index) => {
            if (item.isPrivate === true) {
              return (
                <>
                  <Card
                    className="topic-body"
                    key={index}
                    style={{
                      marginTop: 3,
                      width: '1150px',
                      borderRadius: '9px',
                    }}
                  >
                    <NavLink to={`/topic/${item.id}`} className="title-topic">
                      {item.title}
                    </NavLink>
                    <h4>{item.description}</h4>
                    {item.hashtags.map((hashtag) => {
                      return (
                        <>
                          <Tag
                            key={index}
                            color={ranColor()}
                            className="title-hashtag"
                          >
                            {hashtag.title}
                          </Tag>
                        </>
                      )
                    })}
                    <div className="topic-bottom">
                      <span className="topic-point">
                        Total: {item.totalScore} point
                      </span>
                    </div>
                  </Card>
                </>
              )
            } else return []
          })}
      </div>
    </>
  )
}
export default ShowTopic
