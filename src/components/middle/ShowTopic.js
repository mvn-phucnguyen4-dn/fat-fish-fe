import React, { useContext, useEffect, useState } from 'react'
import 'antd/dist/antd.min.css'
import useHttpClient from '../../hooks/useHttpClient'
import { AuthContext } from '../../context/auth'
import { fetchDataApi } from '../../utils/fetchDataApi'
import './ShowTopic.css'
import { ranColor } from '../../utils/commonFunc'
import { Card, Tag, Input } from 'antd'
import { NavLink } from 'react-router-dom'

function ShowTopic() {
  const { setError } = useHttpClient()
  const [topics, setTopics] = useState([])
  const { currentUser } = useContext(AuthContext)

  const { Search } = Input
  const fetchTopics = async () => {
    try {
      const limit = 30
      const response = await fetchDataApi(
        `topics/?limit=${limit}`,
        currentUser.accessToken,
      )
      setTopics(response.data)
    } catch (error) {
      setError(error.message)
    }
  }
  useEffect(() => {
    fetchTopics()
  }, [])

  return (
    <>
      <div className="top-content-topic">
        <h1 className="title-topic-main">Topic</h1>
        <Search
          className="topic-search"
          placeholder="search tag"
          allowClear
          // onSearch={onSearch}
          style={{
            width: 200,
          }}
        />
      </div>
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
                      borderRadius: '9px',
                    }}
                    headStyle={{ backgroundColor: 'red', height: '20px' }}
                  >
                    {/* <div className="bg-top-card"></div> */}
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
