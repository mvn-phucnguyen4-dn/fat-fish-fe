import React, { useState, useEffect, useContext } from 'react'
import BasicInformation from '../../components/FormElements/BasicInformation/BasicInformation'
import { PlusOutlined } from '@ant-design/icons'
import Section from '../../components/Section/Section'
import './EditTopic.css'
import { Row, Col, Button, Tooltip } from 'antd'
import 'antd/dist/antd.min.css'
import ReactDragListView from 'react-drag-listview'
import { Link, useParams } from 'react-router-dom'
import { fetchDataApi } from '../../utils/fetchDataApi'
import useHttpClient from '../../hooks/useHttpClient'
import ErrorModal from '../../components/Modal/ErrorModal'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { toastOptions, statePromise } from '../../utils/toastOption'
import { AuthContext } from '../../context/auth'

const EditTopic = () => {
  const { topicId } = useParams()
  const { setError, clearError, error } = useHttpClient()
  const [sections, setSections] = useState([])
  const [tags, setTags] = useState([])
  const [users, setUsers] = useState([])
  const [topic, setTopic] = useState({
    title: 'Topic title',
    description: 'Topic description',
    hashtagIds: [],
    releaseScore: false,
    totalScore: 0,
    isPrivate: false,
  })
  const [userId, setUserId] = useState()
  const { currentUser } = useContext(AuthContext)

  const fetchGetTopicById = async () => {
    try {
      const token = currentUser.accessToken
      const response = await toast.promise(
        fetchDataApi(`topics/${topicId}`, token, 'GET'),
        {
          pending: 'Getting topic',
          success: 'Get topic success 👌',
          error: 'Get topic fail 🤯',
        },
        toastOptions,
      )
      if (response.data) {
        const {
          title,
          description,
          hashtags,
          users,
          totalScore,
          isPrivate,
          releaseScore,
          userId,
        } = response.data
        const hashtagIds = hashtags.map((hashtag) => hashtag.id)
        const userIds = users.map((user) => user.id)
        setTopic({
          ...topic,
          title,
          description,
          hashtagIds,
          userIds,
          releaseScore,
          totalScore,
          isPrivate,
        })
        setSections([...response.data.sections])
        setTags([...response.data.hashtags])
        setUsers([...response.data.users])
        setUserId(userId)
      } else {
        setError(response.message)
      }
    } catch (error) {
      setError(error.message)
    }
  }

  const fetchUpdateTopic = async (updateTopic) => {
    try {
      const token = currentUser.accessToken
      const response = await toast.promise(
        fetchDataApi(`topics/${topicId}`, token, 'PUT', updateTopic),
        statePromise,
        toastOptions,
      )
    } catch (error) {
      setError(error.message)
    }
  }

  const fetchPostSection = async () => {
    try {
      const token = currentUser.accessToken
      const response = await toast.promise(
        fetchDataApi('sections', token, 'POST', {
          topicId: parseInt(topicId),
          title: 'Section title',
          questionIds: [],
        }),
        statePromise,
        toastOptions,
      )
      return response.data
    } catch (error) {
      setError(error.message)
    }
  }

  useEffect(() => {
    fetchGetTopicById()
  }, [topicId])

  useEffect(() => {
    const hashtagIds = tags.map((hashtag) => hashtag.id)
    setTopic((prev) => ({ ...prev, hashtagIds: [...hashtagIds] }))
  }, [tags])

  const changeTopicTitle = (topicTitle) => {
    const updateTopic = { ...topic, title: topicTitle }
    fetchUpdateTopic(updateTopic)
    setTopic(updateTopic)
  }

  const changeTopicDescription = (topicDescription) => {
    const updateTopic = { ...topic, description: topicDescription }
    fetchUpdateTopic(updateTopic)
    setTopic(updateTopic)
  }

  const addSection = async () => {
    const section = await fetchPostSection()
    setSections((prev) => [...prev, section])
  }

  const onDragEnd = (fromIndex, toIndex) => {
    if (toIndex < 0) return // Ignores if outside designated area
    setSections((prev) => {
      const sections = [...prev]
      const section = sections.splice(fromIndex, 1)[0]
      sections.splice(toIndex, 0, section)
      return [...sections]
    })
  }

  const removeTag = (tagId) => {
    const updateTags = tags.filter((tag) => tag.id != tagId)
    const updateTagIds = updateTags.map((tag) => tag.id)
    const updateTopic = { ...topic, hashtagIds: updateTagIds }
    fetchUpdateTopic(updateTopic)
    setTags(updateTags)
    setTopic({ ...topic, hashtagIds: updateTagIds })
  }

  const addTag = (tag) => {
    const tagsTitle = tags.map((tag) => tag.title)
    if (!tagsTitle.includes(tag.title)) {
      const updateTags = [...tags, tag]
      const updateTagIds = updateTags.map((tag) => tag.id)
      const updateTopic = { ...topic, hashtagIds: updateTagIds }
      fetchUpdateTopic(updateTopic)
      setTags(updateTags)
      setTopic({ ...topic, hashtagIds: updateTagIds })
    }
  }

  const addUser = (user) => {
    const emails = users.map((user) => user.email)
    if (!emails.includes(user.email)) {
      const updateUsers = [...users, user]
      const updateUserIds = updateUsers.map((user) => user.id)
      const updateTopic = { ...topic, userIds: updateUserIds }
      fetchUpdateTopic(updateTopic)
      setUsers(updateUsers)
      setTopic({ ...topic, userIds: updateUserIds })
    }
  }

  const removeUser = (userId) => {
    const updateUsers = users.filter((user) => user.id != userId)
    const updateUserIds = updateUsers.map((user) => user.id)
    const updateTopic = { ...topic, userIds: updateUserIds }
    fetchUpdateTopic(updateTopic)
    setUsers(updateUsers)
    setTopic({ ...topic, userIds: updateUserIds })
  }

  const changeTopicIsPrivate = (isPrivate) => {
    const updateTopic = { ...topic, isPrivate }
    fetchUpdateTopic(updateTopic)
    setTopic(updateTopic)
  }

  const changeTopicReleaseScore = (releaseScore) => {
    const updateTopic = { ...topic, releaseScore }
    fetchUpdateTopic(updateTopic)
    setTopic(updateTopic)
  }

  return (
    <>
      <ErrorModal error={error} onClose={clearError} />
      <Row style={{ marginTop: '20px' }}>
        <Col xs={0} sm={3} xl={5}></Col>
        <Col xs={24} sm={18} xl={14} className="new-topic">
          <BasicInformation
            changeTopicTitle={changeTopicTitle}
            changeTopicDescription={changeTopicDescription}
            title={topic.title}
            description={topic.description}
            hashtags={tags}
            addTag={addTag}
            removeTag={removeTag}
            fetchUpdateTopic={fetchUpdateTopic}
            changeTopicIsPrivate={changeTopicIsPrivate}
            isPrivate={topic.isPrivate}
            changeTopicReleaseScore={changeTopicReleaseScore}
            releaseScore={topic.releaseScore}
            users={users}
            addUser={addUser}
            removeUser={removeUser}
            userId={userId}
          />
          <div className="new-topic-body">
            <ReactDragListView onDragEnd={onDragEnd} nodeSelector=".section">
              {sections &&
                sections.map((section) => (
                  <Section
                    key={section.id}
                    section={section}
                    topicId={topicId}
                  />
                ))}
            </ReactDragListView>
            <Tooltip
              placement="left"
              title="Add section"
              color="rgb(24 144 255)"
            >
              <Button
                icon={<PlusOutlined />}
                onClick={addSection}
                className="add-section"
              />
            </Tooltip>
          </div>
          <Button
            style={{
              background: 'rgb(24 144 255)',
              color: '#fff',
              marginTop: '10px',
              borderRadius: '6px',
              fontWeight: '500',
            }}
          >
            <Link to={`/users/topic`}>
              Submit <span>&rarr;</span>
            </Link>
          </Button>
        </Col>
        <Col xs={0} sm={3} xl={5}></Col>
      </Row>
      <ToastContainer />
    </>
  )
}

export default EditTopic
