import React, { useState, useContext } from 'react'
import { Button, List, Typography, Modal } from 'antd'
import ReactDragListView from 'react-drag-listview'
import MultipleChoice from '../../Question/MultipleChoice/MultipleChoice'
import ShortAnswer from '../../Question/ShortAnswer/ShortAnswer'
import { AuthContext } from '../../../context/auth'
import './TopicBody.css'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { fetchDataApi } from '../../../utils/fetchDataApi'

const { Text } = Typography

function TopicBody({ sections, topic }) {
  const { currentUser } = useContext(AuthContext)
  const [data, setData] = useState(sections)
  const [check, setCheck] = useState([])
  const [pushData, setPushData] = useState([])
  const onDragEnd = (fromIndex, toIndex) => {
    if (toIndex < 0) return // Ignores if outside designated area

    const items = [...data]
    const item = items.splice(fromIndex, 1)[0]
    items.splice(toIndex, 0, item)
    setData(items)
  }
  const { confirm } = Modal

  const showConfirm = () => {
    confirm({
      title: 'Bạn có chắc chắn nộp bài không ?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Có',
      okType: 'primary',
      cancelText: 'Không',
      async onOk() {
        await createUserAnswer()
        await calcScore()
      },
      onCancel() {},
    })
  }
  const createUserAnswer = async () => {
    await fetchDataApi(`user-answer`, currentUser.accessToken, 'POST', {
      userAnswers: pushData,
    })
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
                            <MultipleChoice
                              idx={index + 1}
                              question={element}
                              pushData={pushData}
                              setPushData={setPushData}
                              topic={item.topicId}
                              section={item.id}
                            />
                          ) : (
                            <ShortAnswer
                              idx={index + 1}
                              question={element}
                              pushData={pushData}
                              setPushData={setPushData}
                              topic={item.topicId}
                              section={item.id}
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
    </>
  )
}

export default TopicBody
