import { PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Col,
  List,
  Modal,
  Pagination,
  Row,
  Table,
  Typography,
} from 'antd'
import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import AddTopicModal from '../../components/Modal/AddTopicModal'
import TopicItem from '../../components/Topic/TopicItem/TopicItem'
import { AuthContext } from '../../context/auth'
import useHttpClient from '../../hooks/useHttpClient'
import { fetchDataApi } from '../../utils/fetchDataApi'
import './ListTopic.css'
import * as XLSX from 'xlsx'

function ListTopic() {
  const { setError } = useHttpClient()
  const [myTopic, setMyTopic] = useState({})
  const [scores, setScores] = useState([])
  const [renderData, setRenderData] = useState([])
  const [columns, setColumns] = useState([])
  const [data, setData] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const { currentUser } = useContext(AuthContext)
  const TOPIC_SIZE = 6

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetchDataApi(
          `topics/my-topic?size=${TOPIC_SIZE}`,
          currentUser.accessToken,
          'GET',
        )
        setMyTopic(response)
        setRenderData(response.data)
      } catch (error) {
        setError(error.message)
      }
    }
    fetchTopics()
  }, [currentUser.accessToken])

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetchDataApi(
          `scores`,
          currentUser.accessToken,
          'GET',
        )
        setScores(response)
      } catch (error) {
        setError(error.message)
      }
    }
    fetchTopics()
  }, [currentUser.accessToken])

  const handlePagination = async (page) => {
    const response = await fetchDataApi(
      `topics/my-topic?page=${page}&size=${TOPIC_SIZE}`,
      currentUser.accessToken,
      'GET',
    )
    setMyTopic(response)
    setRenderData(response.data)
  }

  const prepareData = async () => {
    const submitData = []
    const sectionTitles = new Set(data.map((section) => section.section_title))

    for (const title of sectionTitles) {
      const questions = data.filter(
        (section) => section.section_title === title,
      )
      console.log(questions)
      const section = { title, questions: [] }
      for (const question of questions) {
        const questionObj = {
          userId: currentUser.userId,
          title: question.question_title,
          description: question.question_description,
          score: question.question_score,
          isPrivate: question.is_private,
          type: question.question_type,
          answers: [],
        }
        const propertyAnswer = [
          'answer1',
          'answer2',
          'answer3',
          'answer4',
          'answer5',
        ]
        for (const property in question) {
          if (propertyAnswer.includes(property) && question[property].trim()) {
            questionObj.answers.push({
              answer: question[property],
              isRight: question[property] === question.correct_answer,
            })
          }
        }
        section.questions.push(questionObj)
      }
      submitData.push(section)
    }

    try {
      console.log(submitData)
      const response = await fetchDataApi(
        `topics/import`,
        currentUser.accessToken,
        'POST',
        { sections: submitData },
      )
    } catch (error) {
      console.log(error)
    }
  }

  // process CSV data
  const processData = (dataString) => {
    const dataStringLines = dataString.split(/\r\n|\n/)
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/,
    )

    const list = []
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/,
      )
      if (headers && row.length == headers.length) {
        const obj = {}
        for (let j = 0; j < headers.length; j++) {
          let d = row[j]
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1)
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1)
          }
          if (headers[j]) {
            obj[headers[j]] = d
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj)
        }
      }
    }

    // prepare columns list from headers
    const columns = headers.map((c) => ({
      title: c,
      key: c,
      dataIndex: c,
    }))

    setData(list)
    setColumns(columns)
  }

  const handleUpload = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    // Event listener on reader when the file
    // loads, we parse it and set the data.
    reader.onload = async (evt) => {
      const bstr = evt.target.result
      const wb = XLSX.read(bstr, { type: 'binary' })
      /* Get first worksheet */
      const wsname = wb.SheetNames[0]
      const ws = wb.Sheets[wsname]
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 })
      processData(data)
    }

    reader.readAsBinaryString(file)
  }

  const showModal = () => {
    setOpen(true)
  }

  const handleOk = async () => {
    await prepareData()
    setConfirmLoading(true)
    setTimeout(() => {
      setOpen(false)
      setConfirmLoading(false)
    }, 2000)
  }

  const handleCancel = () => {
    console.log('Clicked cancel button')
    setOpen(false)
  }
  return (
    <>
      <Modal
        title="Upload File"
        visible={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        width={1000}
      >
        <input
          className=""
          onChange={handleUpload}
          name="file"
          type="File"
          accept=".csv,.xlsx,.xls"
          style={{ marginBottom: '10px' }}
        />
        <Table
          columns={columns}
          dataSource={data}
          scroll={{
            x: 'calc(1000px + 50%)',
            y: 240,
          }}
        />
      </Modal>
      <Row>
        <Col xs={2}></Col>
        <Col xs={20}>
          <div className="topic-container">
            <List
              header={
                <div className="topic-header">
                  <Typography.Title level={2}>Your topic</Typography.Title>

                  <div className="topic-header-right">
                    <Button type="primary" onClick={showModal}>
                      Import CSV
                    </Button>
                    <Button
                      shape="circle"
                      icon={<PlusOutlined />}
                      size="large"
                      onClick={() => setIsModalVisible(true)}
                    />
                  </div>
                </div>
              }
              itemLayout="vertical"
              size="large"
              grid={{
                gutter: 16,
                xs: 1,
                sm: 1,
                md: 2,
                lg: 2,
                xl: 3,
                xxl: 3,
              }}
              dataSource={renderData}
              renderItem={(item) => (
                <TopicItem item={item} setRenderData={setRenderData} />
              )}
            />
            {myTopic.meta && (
              <Pagination
                pageSize={myTopic.meta.limit}
                current={myTopic.meta.page}
                total={myTopic.meta.total}
                onChange={handlePagination}
                size="default"
                style={{
                  bottom: '0px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              />
            )}
            <List
              header={
                <div className="topic-header">
                  <Typography.Title level={2}>My Topic result</Typography.Title>
                </div>
              }
              itemLayout="horizontal"
              size="large"
              dataSource={scores.data}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Link
                      key={item.id}
                      to={`/topics/${item.topicId}/review?score=${item.score}`}
                    >
                      Watch detail
                    </Link>,
                  ]}
                >
                  <List.Item.Meta
                    title={<p>{item.topic?.title}</p>}
                    description={
                      item.topic?.description.length > 100
                        ? item.topic?.description.slice(0, 100)
                        : item.topic?.description
                    }
                  />
                  <div>
                    Score: {item.score}/{item.topic.totalScore}
                  </div>
                </List.Item>
              )}
            />
            {scores.meta && (
              <Pagination
                pageSize={scores.meta.limit}
                current={scores.meta.page}
                total={scores.meta.total}
                onChange={handlePagination}
                size="default"
                style={{
                  bottom: '0px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              />
            )}
          </div>
        </Col>
        <Col xs={2}></Col>
      </Row>
      <AddTopicModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
        setRenderData={setRenderData}
      />
    </>
  )
}

export default ListTopic
