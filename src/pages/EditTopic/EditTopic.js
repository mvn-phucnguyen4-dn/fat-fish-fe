import React, { useState, useEffect } from 'react'
import BasicInformation from '../../components/FormElements/BasicInformation/BasicInformation'
import { PlusOutlined } from '@ant-design/icons'
import Section from '../../components/Section/Section'
import './EditTopic.css'
import { Row, Col, Button } from 'antd'
import 'antd/dist/antd.min.css'
import ReactDragListView from 'react-drag-listview'
import { useParams } from 'react-router-dom'
import { getTopicByIdAPI, updateTopicAPI } from '../../utils/topicAPI'
import { auth } from '../../utils/initFirebase'

const EditTopic = () => {
  const { topicId } = useParams()
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

  useEffect(() => {
    const getTopicById = async () => {
      const token = await auth.currentUser.getIdToken()
      const response = await getTopicByIdAPI(topicId, token)
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
    }
    getTopicById()
  }, [topicId])

  const changeTopicTitle = (topicTitle) => {
    setTopic((prev) => ({
      ...prev,
      title: topicTitle,
    }))
  }

  const changeTopicDescription = (topicDescription) => {
    setTopic((prev) => ({ ...prev, description: topicDescription }))
  }

  const changeSectionTitle = (e, index) => {
    setSections((prev) => {
      const sections = [...prev.sections]
      sections[index].title = e.target.value
      return [...sections]
    })
  }

  const addSection = () => {
    setSections((prev) => [...prev, ''])
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
    setTags((prev) => {
      const data = prev.filter((tag) => {
        tag.id != tagId
      })
      return data
    })
    const hashtagIds = tags.map((hashtag) => hashtag.id)
    setTopic((prev) => ({ ...prev, hashtagIds }))
  }

  const addTag = (tag) => {
    const tagsTitle = tags.map((tag) => tag.title)

    if (!tagsTitle.includes(tag.title)) {
      setTags((tags) => [...tags, tag])
    }
    const hashtagIds = tags.map((hashtag) => hashtag.id)
    setTopic((prev) => ({ ...prev, hashtagIds }))
  }

  return (
    <>
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
          />
          <div className="new-topic-body">
            <ReactDragListView onDragEnd={onDragEnd} nodeSelector=".section">
              {sections &&
                sections.map((section, index) => (
                  <Section
                    key={index}
                    section={section}
                    changeSectionTitle={changeSectionTitle}
                    index={index}
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
