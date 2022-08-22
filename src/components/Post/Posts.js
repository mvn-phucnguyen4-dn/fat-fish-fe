import React, { useState, useEffect } from 'react'
import ErrorModal from '../../components/Modal/ErrorModal'
import useHttpClient from '../../hooks/useHttpClient'
import PostList from '../PostList/PostList'
const Posts = ({ cover }) => {
  const [loadedPosts, setLoadedPosts] = useState([])
  const { isLoading, sendReq, error, clearError } = useHttpClient()

  return (
    <>
      <ErrorModal error={error} onClose={clearError} />
      {loadedPosts && (
        <PostList isLoading={isLoading} items={loadedPosts} cover={cover} />
      )}
    </>
  )
}

export default Posts
