import React, { useContext, useEffect, useState } from 'react'
import { List, Radio, Space, Typography, Input } from 'antd'
import ReactDragListView from 'react-drag-listview'
import '../TopicBody/TopicBody.css'
import { fetchDataApi } from '../../../utils/fetchDataApi'
import { AuthContext } from '../../../context/auth'
import useHttpClient from '../../../hooks/useHttpClient'
import hljs from 'highlight.js' // import hljs library
import 'highlight.js/styles/a11y-dark.css'

const { Text, Title } = Typography
const { TextArea } = Input

function UserAnswerBody({ sections, topicId }) {
  const [data, setDate] = useState(sections)
  const [userAnswer, setUserAnswer] = useState([])
  const { currentUser } = useContext(AuthContext)
  const { setError } = useHttpClient()
  const onDragEnd = (fromIndex, toIndex) => {
    if (toIndex < 0) return // Ignores if outside designated area

    const items = [...data]
    const item = items.splice(fromIndex, 1)[0]
    items.splice(toIndex, 0, item)
    setDate(items)
  }

  useEffect(() => {
    updateCodeSyntaxHighlighting()
  }, [])

  const updateCodeSyntaxHighlighting = () => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block)
    })
  }

  useEffect(() => {
    const fetchUserAnswer = async () => {
      try {
        const response = await fetchDataApi(
          `topics/${topicId}/review`,
          currentUser.accessToken,
        )

        setUserAnswer(response.data)
      } catch (error) {
        setError(error.message)
      }
    }
    fetchUserAnswer()
  }, [currentUser.accessToken, topicId])

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
                          {item.title}
                        </Text>
                      }
                      description={item.questions.map((element, index) => (
                        <div key={element.id}>
                          {element.type === 'multi_choice' ? (
                            <>
                              <div className="multi-choice">
                                <div
                                  className="mardown-output"
                                  dangerouslySetInnerHTML={{
                                    __html: element.title,
                                  }}
                                ></div>
                                <Radio.Group
                                  style={{ pointerEvents: 'none' }}
                                  value={
                                    userAnswer.filter(
                                      (item) => item.questionId === element.id,
                                    )[0]?.answerId
                                  }
                                >
                                  <Space direction="vertical">
                                    {element.answers.map((item) => (
                                      <Radio
                                        className="btn-radio"
                                        key={item.id}
                                        value={item.id}
                                      >
                                        {item.answer}
                                      </Radio>
                                    ))}
                                  </Space>
                                </Radio.Group>
                              </div>
                            </>
                          ) : (
                            <div className="short-answer">
                              <div
                                className="mardown-output"
                                dangerouslySetInnerHTML={{
                                  __html: element.title,
                                }}
                              ></div>
                              <TextArea
                                className="short-answer-input"
                                type="text"
                                value={
                                  userAnswer.filter(
                                    (item) => item.questionId === element.id,
                                  )[0]?.answerText
                                }
                                readOnly
                                autoSize
                              ></TextArea>
                            </div>
                          )}
                        </div>
                      ))}
                    ></List.Item.Meta>
                  </List.Item>
                )
              }}
            />
          </ReactDragListView>
        </div>
      )}
    </>
  )
}

export default UserAnswerBody
