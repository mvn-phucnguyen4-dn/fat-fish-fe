import React, { useContext, useEffect, useState } from 'react'
import 'antd/dist/antd.min.css'
import { Table } from 'antd'
import useHttpClient from '../../hooks/useHttpClient'
import { AuthContext } from '../../context/auth'
import { useParams } from 'react-router-dom'
import { fetchDataApi } from '../../utils/fetchDataApi'
import './ListScore.css'

function ListScore() {
  const { setError } = useHttpClient()
  const [data, setData] = useState([])
  const [topic, setTopic] = useState({})
  const [sum, setSum] = useState([])
  const [users, setUsers] = useState([])
  const { currentUser } = useContext(AuthContext)
  const { id } = useParams()
  const [loading, setloading] = useState(true)
  useEffect(async () => {
    currentUser && fetchScore() && setloading(false)
  }, [currentUser, id])
  const fetchScore = async () => {
    try {
      const response = await fetchDataApi(
        `topics/${id}/scores`,
        currentUser.accessToken,
        'GET',
      )
      setData(response.data)
      if (response) {
        console.log('response', response)
        for (let i = 0; i < response.length; i++) {
          console.log('hello')
          const res = await fetchDataApi(
            `users/${data[i].userId}`,
            currentUser.accessToken,
            'GET',
          )
          setUsers((prev) => [...prev, res.data])
        }
      }
    } catch (error) {
      console.log(error)
      setError(error.message)
    }
  }
  // const fetchDataUser = async () => {
  //   try {
  //     if (data) {

  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  console.log('data user', users)
  const columns = [
    {
      title: 'Topic',
      dataIndex: `topicId`,
      width: 150,
    },
    {
      title: 'Name',
      dataIndex: 'userId',
      width: 150,
    },
    {
      title: 'Score',
      dataIndex: 'score',
      width: 150,
    },
  ]

  return (
    <div>
      <Table
        columns={columns}
        loading={loading}
        dataSource={data}
        // pagination={{ pageSize: 50 }}
      />
      ,
    </div>
  )
}

export default ListScore
