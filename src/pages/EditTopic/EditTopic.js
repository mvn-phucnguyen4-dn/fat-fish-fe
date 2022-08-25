import React, { useState, useEffect, useCallback } from 'react'
import BasicInformation from '../../components/FormElements/BasicInformation/BasicInformation'
import { PlusOutlined } from '@ant-design/icons'
import Section from '../../components/Section/Section'
import './EditTopic.css'
import { Row, Col, Button } from 'antd'
import 'antd/dist/antd.min.css'
import ReactDragListView from 'react-drag-listview'
import { useParams } from 'react-router-dom'
import { fetchDataApi } from '../../utils/fetchDataApi'
import { auth } from '../../utils/initFirebase'
import useHttpClient from '../../hooks/useHttpClient'
import ErrorModal from '../../components/Modal/ErrorModal'

const EditTopic = () => {
  const { topicId } = useParams()
  const { setError, clearError, error } = useHttpClient()
  const [sections, setSections] = useState([])
  const [tags, setTags] = useState([])
  const [topic, setTopic] = useState({
    title: 'Topic title',
    description: 'Topic description',
    hashtagIds: [],
    releaseScore: true,
    totalScore: 0,
    isPrivate: false,
  })

  const fetchGetTopicById = async () => {
    try {
      const token = await auth.currentUser.getIdToken()
      const response = await fetchDataApi(`topics/${topicId}`, token, 'GET')
      if (response.data) {
        const {
          title,
          description,
          hashtags,
          totalScore,
          isPrivate,
          releaseScore,
        } = response.data
        const hashtagIds = hashtags.map((hashtag) => hashtag.id)
        setTopic({
          ...topic,
          title,
          description,
          hashtagIds,
          releaseScore,
          totalScore,
          isPrivate,
        })
        setSections([...response.data.sections])
        setTags([...response.data.hashtags])
      } else {
        setError(response.message)
      }
    } catch (error) {
      setError(error.message)
    }
  }

  const fetchUpdateTopic = async (updateTopic) => {
    try {
      const token = await auth.currentUser.getIdToken()
      const response = await fetchDataApi(
        `topics/${topicId}`,
        token,
        'PUT',
        updateTopic,
      )
    } catch (error) {
      setError(error.message)
<<<<<<< HEAD
    }
  }

  const fetchPostSection = async () => {
    try {
      const token = await auth.currentUser.getIdToken()
      const response = await fetchDataApi('sections', token, 'POST', {
        topicId: parseInt(topicId),
        title: 'Section title',
        questionIds: [],
      })
      return response.data
    } catch (error) {
      setError(error.message)
=======
>>>>>>> 3dc8045af79fcc4c187ce5eb63b863f50b70301c
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

  const changeTopicIsPrivate = (isPrivate) => {
    const updateTopic = { ...topic, isPrivate }
    fetchUpdateTopic(updateTopic)
    setTopic(updateTopic)
  }

  return (
    <>
      <ErrorModal error={error} onClose={clearError} />
      <Row>
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
            <Button
              icon={<PlusOutlined />}
              onClick={addSection}
              className="add-section"
            />
          </div>
          <Button className="btn" type="button">
            Submit <span>&rarr;</span>
          </Button>
        </Col>
        <Col xs={0} sm={3} xl={5}></Col>
      </Row>
    </>
  )
}

export default EditTopic
