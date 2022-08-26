import React, { useEffect, useState, useContext } from 'react'
import './ShowTopic.css'
import { ranColor, changeDate } from '../../utils/commonFunc'
import { Card, Tag } from 'antd'
import { NavLink } from 'react-router-dom'
import { fetchDataApi } from '../../utils/fetchDataApi'
import { AuthContext } from '../../context/auth'

const ShowTopic = () => {
  const [topics, setTopics] = useState([])
  const { currentUser } = useContext(AuthContext)
  const fetchTopics = async () => {
    try {
      const responseData = await fetchDataApi(
        `topics`,
        currentUser.accessToken,
        'GET',
      )
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
                      <h3>{item.title}</h3>
                    </NavLink>
                    <p>{item.description}</p>
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
