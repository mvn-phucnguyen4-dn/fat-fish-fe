import React, { useEffect, useState } from 'react'
import { Button, List, Typography } from 'antd'
import ReactDragListView from 'react-drag-listview'
import MultipleChoice from '../../Question/MultipleChoice/MultipleChoice'
import ShortAnswer from '../../Question/ShortAnswer/ShortAnswer'
import './TopicRemark.css'
import MarkShortAnswer from '../../Question/MarkShortAnswer/MarkShortAnswer'

const { Text } = Typography

function TopicRemark({ topic, sections, userAnswers }) {
  console.log(userAnswers)
  return (
    <>
      {sections && (
        <div>
          <List
            size="small"
            split={true}
            dataSource={sections}
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
                    description={item.questions.map((element, index) => {
                      const userAnswer = userAnswers.find(
                        (answer) => answer.questionId === element.id,
                      )
                      return (
                        <div key={element.id}>
                          {element.type === 'multi_choice' ? (
                            <MultipleChoice
                              idx={index + 1}
                              question={element}
                              userAnswer={userAnswer}
                            />
                          ) : (
                            <MarkShortAnswer
                              idx={index + 1}
                              topic={topic}
                              question={element}
                              userAnswer={userAnswer}
                            />
                          )}
                        </div>
                      )
                    })}
                  ></List.Item.Meta>
                </List.Item>
              )
            }}
          />
        </div>
      )}
    </>
  )
}

export default TopicRemark
