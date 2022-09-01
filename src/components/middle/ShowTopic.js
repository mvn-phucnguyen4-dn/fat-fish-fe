import React, { useContext, useEffect, useState, useMemo } from 'react'
import 'antd/dist/antd.min.css'
import useHttpClient from '../../hooks/useHttpClient'
import { AuthContext } from '../../context/auth'
import { fetchDataApi } from '../../utils/fetchDataApi'
import './ShowTopic.css'
import { ranColor } from '../../utils/commonFunc'
import { Card, Tag, Input, Pagination } from 'antd'
import { NavLink } from 'react-router-dom'

function ShowTopic() {
  const { setError } = useHttpClient()
  const [topics, setTopics] = useState([])
  const [condition, setCondition] = useState({})

  const { currentUser } = useContext(AuthContext)
  const TOPIC_SIZE = 6
  const { Search } = Input

  useEffect(() => {
    const fetchTopics = async (TOPIC_SIZE) => {
      try {
        const response = await fetchDataApi(
          `topics/?size=${TOPIC_SIZE}`,
          currentUser.accessToken,
        )
        setTopics(response.data)
        setCondition(response)
      } catch (error) {
        setError(error.message)
      }
    }
    fetchTopics()
  }, [currentUser.accessToken])
  const handlePagination = async (page) => {
    const response = await fetchDataApi(
      `topics/?page=${page}&size=${TOPIC_SIZE}`,
      currentUser.accessToken,
      'GET',
    )
    setTopics(response.data)
    setCondition(response)
  }
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
      {condition && (
        <Pagination
          style={{ margin: '15px auto' }}
          pageSize={condition.meta.limit}
          current={condition.meta.page}
          total={condition.meta.total}
          onChange={handlePagination}
        />
      )}
    </>
  )
}
export default ShowTopic
