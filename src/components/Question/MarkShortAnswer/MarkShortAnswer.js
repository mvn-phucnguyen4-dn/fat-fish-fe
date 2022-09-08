import { CloseOutlined, CheckOutlined } from '@ant-design/icons/lib/icons'
import { Typography, Input, Switch } from 'antd'
import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import { AuthContext } from '../../../context/auth'
import { fetchDataApi } from '../../../utils/fetchDataApi'
import './MarkShortAnswer.css'

const { TextArea } = Input
const { Title, Paragraph } = Typography

function useQuery() {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}

function MarkShortAnswer({ idx, topic, question, userAnswer }) {
  const query = useQuery()
  const { currentUser } = useContext(AuthContext)
  const onChange = async (checked) => {
    await fetchDataApi(
      `topics/${topic.id}/user-answers/${userAnswer.id}`,
      currentUser.accessToken,
      'PUT',
      { isRight: checked },
    )
    await fetchDataApi(
      `topics/${topic.id}/scores/${query.get('scoreId')}`,
      currentUser.accessToken,
      'PUT',
    )
  }
  return (
    <div className="short-answer">
      <Title
        className={`${userAnswer.isRight ? 'correct' : 'incorrect'}`}
        level={4}
      >
        <p>
          {userAnswer.isRight ? <CheckOutlined /> : <CloseOutlined />}
          {'   '}
          {question.title}
        </p>
      </Title>
      <TextArea
        className="short-answer-input"
        type="text"
        value={userAnswer.answerText}
        readOnly
        autoSize
      ></TextArea>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Paragraph style={{ maxWidth: '80%' }}>
          <b>Description: </b>
          {question.description}
        </Paragraph>
        <Switch
          checkedChildren="true"
          unCheckedChildren="false"
          defaultChecked={userAnswer.isRight}
          onChange={onChange}
        />
      </div>
    </div>
  )
}

export default MarkShortAnswer
