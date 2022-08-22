import React, { useState } from 'react'
import { Button, List, Typography } from 'antd'
import ReactDragListView from 'react-drag-listview'
import MultipleChoice from '../../Question/MultipleChoice/MultipleChoice'
import ShortAnswer from '../../Question/ShortAnswer/ShortAnswer'
import './TopicBody.css'

const { Text } = Typography

function TopicBody({ sections }) {
  const [data, setDate] = useState(sections)
  const onDragEnd = (fromIndex, toIndex) => {
    if (toIndex < 0) return // Ignores if outside designated area

    const items = [...data]
    const item = items.splice(fromIndex, 1)[0]
    items.splice(toIndex, 0, item)
    setDate(items)
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
                            />
                          ) : (
                            <ShortAnswer idx={index + 1} question={element} />
                          )}
                        </div>
                      ))}
                    ></List.Item.Meta>
                  </List.Item>
                )
              }}
            />
            <Button className="btn-submit" type="primary" size="large">
              Submit
            </Button>
          </ReactDragListView>
        </div>
      )}
    </>
  )
}

export default TopicBody
