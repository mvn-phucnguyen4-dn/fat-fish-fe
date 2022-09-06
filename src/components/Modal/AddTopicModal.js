import { Form, Input, InputNumber, Modal, Radio } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import React, { useContext } from 'react'
import { AuthContext } from '../../context/auth'
import useHttpClient from '../../hooks/useHttpClient'
import { fetchDataApi } from '../../utils/fetchDataApi'

function AddTopicModal({ isModalVisible, setIsModalVisible, setRenderData }) {
  const { setError } = useHttpClient()
  const [form] = Form.useForm()
  const { currentUser } = useContext(AuthContext)

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields()
        onFinish(values)
      })
      .catch((info) => {
        onFinishFailed(info)
      })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onFinish = async (values) => {
    try {
      const response = await fetchDataApi(
        `topics`,
        currentUser.accessToken,
        'POST',
        values,
      )
      if (response) {
        const newValue = { ...values, hashtags: [] }
        setRenderData((oldData) => [...oldData, newValue])
        setIsModalVisible(false)
      }
    } catch (error) {
      setError(error.message)
    }
  }

  return (
    <Modal
      title="Add topic"
      visible={isModalVisible}
      okText="Create"
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
          isPrivate: false,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[
            {
              required: true,
              message: 'Please input your title!',
            },
          ]}
        >
          <Input placeholder="Title..." />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[
            {
              required: true,
              message: 'Please input your description!',
            },
          ]}
        >
          <TextArea rows={4} placeholder="Description..." />
        </Form.Item>
        <Form.Item name="isPrivate">
          <Radio.Group style={{ display: 'flex' }}>
            <Radio value={false}>Private</Radio>
            <Radio value={true}>Public</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddTopicModal
