import React, { useEffect, useState } from 'react'
import { BodyInput } from '../FormElements/BodyInput/BodyInput'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import styles from './Question.module.css'
import { Select, InputNumber, Button, Switch, Tooltip } from 'antd'
import AnswerKeyModal from '../Modal/AnswerKeyModel'
import { auth } from '../../utils/initFirebase'
import { fetchDataApi } from '../../utils/fetchDataApi'
import useHttpClient from '../../hooks/useHttpClient'
import ErrorModal from '../Modal/ErrorModal'
import { toast } from 'react-toastify'
import { toastOptions, statePromise } from '../../utils/toastOption'

const { Option } = Select
const TYPE_MULTIPLE_CHOICE = 'multi_choice'
const TYPE_TEXT_ANSWER = 'short_answer'
const MAX_OPTION = 5

const Question = (props) => {
  const [showModal, setShowModal] = useState(false)
  const [question, setQuestion] = useState({})
  const [answers, setAnswers] = useState([])
  const { removeQuestion, id: questionId, updateQuestions } = props
  const { setError, clearError, error } = useHttpClient()

  useEffect(() => {
    const { description, title, imageUrl, score, type, isPrivate } =
      props.question
    setQuestion({ description, title, imageUrl, score, type, isPrivate })

    const newAnswers =
      props.question.answers &&
      props.question.answers.map((answer) => {
        return {
          questionId: answer.questionId,
          answer: answer.answer,
          isRight: answer.isRight,
        }
      })

    if (newAnswers) setAnswers([...newAnswers])
  }, [props.question])

  const fetchUpdateQuestion = async (updateQuestion) => {
    try {
      const token = await auth.currentUser.getIdToken()
      const response = await toast.promise(
        fetchDataApi(`questions/${questionId}`, token, 'PUT', updateQuestion),
        statePromise,
        toastOptions,
      )
      if (response.data) {
        updateQuestions(response.data)
      }
    } catch (error) {
      setError(error.message)
    }
  }

  const fetchUpdateQuestionAnswer = async (updateAnswers) => {
    try {
      const token = await auth.currentUser.getIdToken()
      const response = await toast.promise(
        fetchDataApi(`questions/${questionId}/answers`, token, 'PUT', {
          answers: updateAnswers,
        }),
        statePromise,
        toastOptions,
      )
      return response.data
    } catch (error) {
      setError(error.message)
    }
  }

  const changeType = (type) => {
    const updateQuestion = { ...question, type }
    fetchUpdateQuestion(updateQuestion)
    setQuestion((prev) => {
      return { ...prev, type }
    })
  }

  const changeScore = (score) => {
    const updateQuestion = { ...question, score }
    fetchUpdateQuestion(updateQuestion)
    setQuestion((prev) => {
      return { ...prev, score }
    })
  }

  const changeAnswer = (e, index) => {
    setAnswers((answer) => {
      const data = [...answer]
      data[index].answer = e.target.value
      return data
    })
  }

  const changeTitle = (title) => {
    const updateQuestion = { ...question, title }
    fetchUpdateQuestion(updateQuestion)
    setQuestion((prev) => {
      return { ...prev, title }
    })
  }

  const changeDescription = (description) => {
    const updateQuestion = { ...question, description }
    fetchUpdateQuestion(updateQuestion)
    setQuestion((prev) => {
      return { ...prev, description }
    })
  }

  const changeIsPrivate = (isPrivate) => {
    const updateQuestion = { ...question, isPrivate }
    fetchUpdateQuestion(updateQuestion)
    setQuestion((prev) => {
      return { ...prev, isPrivate }
    })
  }
  const handleRemoveQuestion = () => {
    removeQuestion(question.id)
  }

  const removeAnswer = async (e, index) => {
    const updateAnswers = answers.filter((answer, i) => i !== index)
    const answer = await fetchUpdateQuestionAnswer(updateAnswers)
    setAnswers([...updateAnswers])
  }

  const addAnswer = async () => {
    if (answers.length < 5) {
      const updateAnswers = [
        ...answers,
        { questionId, answer: 'New option', isRight: false },
      ]
      const answer = await fetchUpdateQuestionAnswer(updateAnswers)
      setAnswers((prev) => {
        return [...updateAnswers]
      })
    }
  }

  const changeIsRight = async (answer) => {
    const updateAnswers = answers.map((item) => {
      if (item.answer === answer) return { ...item, isRight: true }
      return { ...item, isRight: false }
    })

    await fetchUpdateQuestionAnswer(updateAnswers)
    setAnswers((prev) => {
      return [...updateAnswers]
    })
  }

  const blurAnswer = async (e, index) => {
    const updateAnswers = [...answers]
    updateAnswers[index].answer = e.target.value.trim()
    const answer = await fetchUpdateQuestionAnswer(updateAnswers)
    setAnswers((prev) => {
      return [...updateAnswers]
    })
  }

  return (
    <>
      <ErrorModal error={error} onClose={clearError} />
      <AnswerKeyModal
        onClose={() => setShowModal(false)}
        show={showModal}
        questionTitle={question.title}
        questionId={questionId}
        answers={answers}
        changeIsRight={changeIsRight}
      ></AnswerKeyModal>
      <div className={`${styles['question-multiple-choice']}`}>
        <BodyInput value={question.title} handleChange={changeTitle} />
        <BodyInput
          value={question.description}
          handleChange={changeDescription}
        />
        {question.type === TYPE_MULTIPLE_CHOICE && (
          <div className={styles['option-wrapper']}>
            <div className={styles['list-option']}>
              {answers &&
                answers.map((answer, index) => (
                  <div className={`${styles['option']}`} key={index}>
                    <input type="radio" className={styles['radio']} />
                    <div className={styles['brise-input']}>
                      <input
                        type="text"
                        name="text"
                        value={answer.answer}
                        onChange={(e) => changeAnswer(e, index)}
                        onBlur={(e) => blurAnswer(e, index)}
                      />
                      <span className={styles.line}></span>
                    </div>
                    {answers.length > 1 && (
                      <Tooltip
                        placement="bottom"
                        title="Remove option"
                        color="rgb(24 144 255)"
                      >
                        <DeleteOutlined
                          onClick={(e) => removeAnswer(e, index)}
                        />
                      </Tooltip>
                    )}
                  </div>
                ))}
              <Tooltip
                placement="right"
                title="Add option"
                color="rgb(24 144 255)"
              >
                <Button
                  icon={<PlusOutlined />}
                  onClick={addAnswer}
                  className={styles['add-option']}
                  shape="circle"
                  disabled={answers.length === MAX_OPTION}
                  size="small"
                />
              </Tooltip>
            </div>
          </div>
        )}
        <div className={styles['question-footer']}>
          <div className={styles['answer-key']}>
            {question.type === TYPE_MULTIPLE_CHOICE && (
              <Button
                color="rgb(24 144 255)"
                onClick={(e) => {
                  setShowModal(true)
                }}
              >
                Answer key
              </Button>
            )}
            <Tooltip
              placement="top"
              title={`${!question.isPrivate ? 'Open' : 'Close'} question`}
              color="rgb(24 144 255)"
            >
              <Switch checked={question.isPrivate} onChange={changeIsPrivate} />
            </Tooltip>
          </div>
          <div className={styles['action']}>
            <Tooltip
              placement="top"
              title="Remove question"
              color="rgb(24 144 255)"
            >
              <Button
                icon={<DeleteOutlined />}
                className={styles['delete-question']}
                onClick={handleRemoveQuestion}
              />
            </Tooltip>
            <Select
              style={{ width: 120 }}
              onChange={changeType}
              value={question.type}
            >
              <Option value={TYPE_MULTIPLE_CHOICE}>Multiple choice</Option>
              <Option value={TYPE_TEXT_ANSWER}>Text answer</Option>
            </Select>
            <InputNumber
              min={0}
              max={10}
              step={1}
              value={question.score}
              onChange={changeScore}
            ></InputNumber>
          </div>
        </div>
      </div>
    </>
  )
}

export default Question
