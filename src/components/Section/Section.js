import React, { useState, useEffect } from 'react'
import Question from '../NewQuestion/Question'
import TextareaAutosize from 'react-textarea-autosize'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import './Section.css'
import { fetchDataApi } from '../../utils/fetchDataApi'
import { auth } from '../../utils/initFirebase'
import useHttpClient from '../../hooks/useHttpClient'
import ErrorModal from '../Modal/ErrorModal'

const Section = (props) => {
  const [section, setSection] = useState({})
  const [questions, setQuestions] = useState([])
  const { setError, clearError, error } = useHttpClient()

  useEffect(() => {
    const questionIds = props.section.questions.map((question) => question.id)
    const { title, id } = props.section
    setSection({ questionIds, title, id })
    setQuestions([...props.section.questions])
  }, [props.section, props.section.questions])

  const fetchUpdateSection = async (section) => {
    try {
      const token = await auth.currentUser.getIdToken()
      const response = await fetchDataApi(
        `sections/${section.id}`,
        token,
        'PUT',
        {
          title: section.title,
          questionIds: section.questionIds,
        },
      )
    } catch (error) {
      console.log(error)
      setError(error.message)
    }
  }

  const fetchPostQuestion = async () => {
    try {
      const token = await auth.currentUser.getIdToken()
      const response = await fetchDataApi('questions', token, 'POST', {
        type: 'multi_choice',
        title: 'Question title',
        imageUrl: '',
        description: 'Question description',
        score: 10,
        isPrivate: false,
      })
      return response.data
    } catch (error) {
      console.log(error)
      setError(error.message)
    }
  }

  const changeTitle = (e) => {
    setSection((prev) => ({ ...prev, title: e.target.value }))
  }

  const changeSectionTitle = (e) => {
    const sectionTitle = e.target.value
    const updateSection = {
      ...section,
      title: sectionTitle,
    }
    fetchUpdateSection(updateSection)
    setSection({ ...section, title: sectionTitle })
  }

  const addQuestion = async () => {
    const question = await fetchPostQuestion()
    const updateSection = {
      ...section,
      questionIds: [...section.questionIds, question.id],
    }
    fetchUpdateSection(updateSection)
    setQuestions((questions) => [...questions, question])
    setSection(updateSection)
  }

  const removeQuestion = (questionId) => {
    const questionIds = section.questionIds.filter((id) => id != questionId)
    const updateSection = {
      ...section,
      questionIds: questionIds,
    }
    fetchUpdateSection(updateSection)
    setQuestions((questions) =>
      questions.filter((question) => question.id !== questionId),
    )
    setSection(updateSection)
  }

  const updateQuestions = (question) => {
    setQuestions((prev) => {
      const questionIdx = questions.findIndex((item) => item.id === question.id)
      prev[questionIdx] = question
      return prev
    })
  }

  return (
    <>
      <ErrorModal error={error} onClose={clearError} />
      <div className="section">
        <TextareaAutosize
          rows={1}
          className="title-topic"
          autoSize
          value={section.title}
          onChange={changeTitle}
          onBlur={changeSectionTitle}
        />

        {questions &&
          questions.map((question, index) => (
            <Question
              key={index}
              removeQuestion={() => removeQuestion(question.id)}
              question={question}
              id={question.id}
              updateQuestions={updateQuestions}
            />
          ))}
        <Button
          icon={<PlusOutlined />}
          className="add-question"
          onClick={addQuestion}
        />
      </div>
    </>
  )
}

export default Section
