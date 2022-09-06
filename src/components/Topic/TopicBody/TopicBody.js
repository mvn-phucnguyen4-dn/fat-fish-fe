import React, { useState, useContext, useEffect } from 'react'
import { Button, List, Typography, Modal, Alert } from 'antd'
import ReactDragListView from 'react-drag-listview'
import MultipleChoice from '../../Question/MultipleChoice/MultipleChoice'
import ShortAnswer from '../../Question/ShortAnswer/ShortAnswer'
import { AuthContext } from '../../../context/auth'
import './TopicBody.css'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { fetchDataApi } from '../../../utils/fetchDataApi'
import { useHistory } from 'react-router-dom'

const { Text } = Typography

function TopicBody({ sections, topic }) {
  const { currentUser } = useContext(AuthContext)
  const [data, setData] = useState(sections)
  const [isShowAlert, setIsShowAlert] = useState(false)

  const [pushData, setPushData] = useState([])
  const history = useHistory()
  const onDragEnd = (fromIndex, toIndex) => {
    if (toIndex < 0) return // Ignores if outside designated area

    const items = [...data]
    const item = items.splice(fromIndex, 1)[0]
    items.splice(toIndex, 0, item)
    setData(items)
  }
  const { confirm } = Modal
  const initShortAnswerEmpty = () => {
    for (let i = 0; i < data.length; i++) {
      const questions = data[i].questions
      for (let i = 0; i < questions.length; i++) {
        if (questions[i].type === 'short_answer') {
          setPushData((prev) => [
            ...prev,
            {
              topicId: topic.id,
              sectionId: data[0].id,
              questionId: questions[i].id,
              answerText: null,
              answerId: null,
            },
          ])
        }
      }
    }
  }
  useEffect(() => {
    initShortAnswerEmpty()
  }, [])
  const showConfirm = () => {
    confirm({
      title: 'Bạn có chắc chắn nộp bài không ?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Có',
      okType: 'primary',
      cancelText: 'Không',
      async onOk() {
        const data = await createUserAnswer()
        await calcScore()
        if (data.meta.submit_flag) {
          setIsShowAlert(true)
        }
        // history.push({ pathname: '/result', state: { topic: topic.title } })
      },
      onCancel() {},
    })
  }
  const createUserAnswer = async () => {
    const res = await fetchDataApi(
      `user-answers`,
      currentUser.accessToken,
      'POST',
      {
        topicId: topic.id,
        userAnswers: pushData,
      },
    )
    return res
  }
  const calcScore = async () => {
    const topicId = topic.id
    await fetchDataApi(
      `topics/${topicId}/mark-score`,
      currentUser.accessToken,
      'POST',
      {
        data: topicId,
      },
    )
  }
  const onChange = (answerId, question) => {
    if (question.type === 'multi_choice') {
      const answerIndex = pushData.findIndex(
        (item) => item.questionId === question.id,
      )
      if (answerIndex !== -1) {
        pushData[answerIndex].answerId = answerId
        setPushData(pushData)
      } else {
        setPushData((prev) => [
          ...prev,
          {
            topicId: topic.id,
            sectionId: data[0].id,
            questionId: question.id,
            answerId: answerId,
            answerText: null,
          },
        ])
      }
    }
  }
  const onBlur = (value, question) => {
    const answerIndex = pushData.findIndex(
      (item) => item.questionId === question.id,
    )
    if (answerIndex !== -1) {
      pushData[answerIndex].answerText = value
      setPushData(pushData)
    } else {
      setPushData((prev) => [
        ...prev,
        {
          topicId: topic.id,
          sectionId: data[0].id,
          questionId: question.id,
          answerText: value,
          answerId: null,
        },
      ])
    }
  }
  return (
    <>
      {data && (
        <div>
          <ReactDragListView
            nodeSelector=".ant-list-item.draggble"
            onDragEnd={onDragEnd}
          >
            <List
              size="small"
              split={true}
              dataSource={data}
              renderItem={(item) => {
                const draggble = item.id !== -1 // Allow all item can drag
                return (
                  <List.Item className={draggble ? 'section draggble' : ''}>
                    <List.Item.Meta
                      className="section-item"
                      title={
                        <Text
                          className="section-title"
                          style={{ marginBottom: '50px' }}
                        >
                          <p fontSize={'16px'}>{item.title}</p>
                        </Text>
                      }
                      description={item.questions.map((element, index) => (
                        <div key={element.id}>
                          {element.type === 'multi_choice' ? (
                            <MultipleChoice
                              idx={index + 1}
                              question={element}
                              onChange={onChange}
                            />
                          ) : (
                            <ShortAnswer
                              idx={index + 1}
                              question={element}
                              onBlur={onBlur}
                              onChange={onChange}
                            />
                          )}
                        </div>
                      ))}
                    ></List.Item.Meta>
                  </List.Item>
                )
              }}
            />
            <Button
              className="btn-submit"
              type="primary"
              size="large"
              onClick={showConfirm}
            >
              Submit
            </Button>
          </ReactDragListView>
        </div>
      )}
      {isShowAlert == true && (
        <Alert
          type="error"
          message="Ban da nop bai roi"
          onClose={() => setIsShowAlert(false)}
          showIcon={true}
        />
      )}
    </>
  )
}

export default TopicBody
