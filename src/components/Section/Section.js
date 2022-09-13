import React, { useState, useEffect, useContext } from 'react'
import Question from '../NewQuestion/Question'
import TextareaAutosize from 'react-textarea-autosize'
import { Button, Tooltip } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import './Section.css'
import { fetchDataApi } from '../../utils/fetchDataApi'
import useHttpClient from '../../hooks/useHttpClient'
import ErrorModal from '../Modal/ErrorModal'
import { toast } from 'react-toastify'
import { toastOptions, statePromise } from '../../utils/toastOption'
import { AuthContext } from '../../context/auth'

const Section = (props) => {
  const [section, setSection] = useState({})
  const [questions, setQuestions] = useState([])
  const { setError, clearError, error } = useHttpClient()
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    const questionIds = props.section.questions.map((question) => question.id)
    const { title, id } = props.section
    setSection({ questionIds, title, id })
    setQuestions([...props.section.questions])
  }, [props.section, props.section.questions])

  const fetchUpdateSection = async (section) => {
    try {
      const token = currentUser.accessToken
      const response = await fetchDataApi(
        `sections/${section.id}`,
        token,
        'PUT',
        {
          title: section.title,
          questionIds: section.questionIds,
        },
      )
      toast.success('Saved', toastOptions)
    } catch (error) {
      setError(error.message)
    }
  }

  const fetchPostQuestion = async () => {
    try {
      const token = currentUser.accessToken
      const response = await fetchDataApi('questions', token, 'POST', {
        type: 'multi_choice',
        title: 'Question title',
        imageUrl: '',
        description: 'Question description',
        score: 10,
        isPrivate: false,
      })
      toast.success('Saved', toastOptions)
      return response.data
    } catch (error) {
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
          className="title-section"
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
        <Tooltip placement="left" title="Add question" color="rgb(24 144 255)">
          <Button
            icon={<PlusOutlined />}
            className="add-question"
            onClick={addQuestion}
          />
        </Tooltip>
      </div>
    </>
  )
}

export default Section
