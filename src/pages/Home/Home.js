import React, { useState } from 'react'
import Posts from '../../components/Post/Posts'
import RightSideBar from '../../components/RightSideBar/RightSideBar'
import LeftSideBar from '../../components/LeftSideBar/LeftSideBar'
import useHttpClient from '../../hooks/useHttpClient'
import Banner from '../../components/Banner/Banner'
import ShowTopic from '../../components/middle/ShowTopic'

const Home = () => {
  const [tags, setTags] = useState([])
  const { sendReq, isLoading } = useHttpClient()

  return (
    <>
      <Banner />
      <div className="container-layout">
        <div className="container-sidebar">
          <LeftSideBar />
        </div>
        <Posts cover={true} />
        <RightSideBar tags={tags} isLoading={isLoading} />
      </div>
    </>
  )
}

export default Home
