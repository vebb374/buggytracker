import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Space, 
  Typography, 
  Alert, 
  Divider, 
  Spin
} from 'antd';
import { 
  SaveOutlined, 
  LoadingOutlined,
  PlusOutlined
} from '@ant-design/icons';
import type { TicketEditorProps, Ticket } from '../../types';
import dayjs, { type Dayjs } from 'dayjs';

const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;

// Variable delay for validation challenges
const getValidationDelay = (): number => {
  return Math.floor(Math.random() * 2500) + 1500; // 1.5-4 seconds
};

// Simulate network delay
const getNetworkDelay = (): number => {
  return Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
};

const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'] as const;
const STATUS_OPTIONS = ['TODO', 'WORKING', 'DONE'] as const;
const PREDEFINED_TAGS = [
  'UI/UX', 'Backend', 'Frontend', 'Database', 'Performance', 
  'Security', 'Bug', 'Feature', 'Enhancement', 'Critical'
];

export const TicketEditor: React.FC<TicketEditorProps> = ({
  ticket,
  isOpen,
  onSave,
  onCancel,
  mode
}) => {
  const [form] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [tagOptions, setTagOptions] = useState<string[]>(PREDEFINED_TAGS);
  const [newTagInput, setNewTagInput] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Initialize form with ticket data
  useEffect(() => {
    if (isOpen && ticket) {
      // Combine predefined tags with tags from the ticket to create a unique set of options
      const allTags = [...new Set([...PREDEFINED_TAGS, ...ticket.tags])];
      setTagOptions(allTags);

      form.setFieldsValue({
        title: ticket.title,
        description: ticket.description || '',
        priority: ticket.priority,
        status: ticket.status,
        assignee: ticket.assignee,
        deadline: ticket.deadline ? dayjs(ticket.deadline) : null,
        tags: ticket.tags
      });
    } else if (isOpen && mode === 'create') {
      form.resetFields();
      setTagOptions(PREDEFINED_TAGS);
    }
  }, [isOpen, ticket, mode, form]);

  const validateForm = async (): Promise<boolean> => {
    setIsValidating(true);
    setValidationErrors([]);
    setFieldErrors({});

    // Simulate validation delay for automation challenges
    const delay = getValidationDelay();
    await new Promise(resolve => setTimeout(resolve, delay));

    const values = form.getFieldsValue();
    const errors: string[] = [];
    const fieldErrs: Record<string, string> = {};

    // Custom validation logic with automation challenges
    if (!values.title || values.title.trim().length < 3) {
      errors.push('Title must be at least 3 characters');
      fieldErrs.title = 'Title too short';
    }

    if (values.title && values.title.length > 100) {
      errors.push('Title must be less than 100 characters');
      fieldErrs.title = 'Title too long';
    }

    if (!values.assignee) {
      errors.push('Assignee is required');
      fieldErrs.assignee = 'Required field';
    }

    if (!values.priority) {
      errors.push('Priority must be selected');
      fieldErrs.priority = 'Required field';
    }

    // Network failure simulation
    if (Math.random() < 0.15) { // 15% chance
      errors.push('Network validation timeout - Please try again');
    }

    setValidationErrors(errors);
    setFieldErrors(fieldErrs);
    setIsValidating(false);

    return errors.length === 0;
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      // Validate form first
      const isValid = await validateForm();
      if (!isValid) {
        setIsSaving(false);
        return;
      }

      // Get form values
      const values = form.getFieldsValue();
      
      // Simulate network delay
      const networkDelay = getNetworkDelay();
      await new Promise(resolve => setTimeout(resolve, networkDelay));

      // Network failure simulation
      if (Math.random() < 0.1) { // 10% chance
        throw new Error('Network save failed - Please retry');
      }

      // Create updated ticket
      const updatedTicket: Ticket = {
        id: ticket?.id || `TICKET-${Date.now()}`,
        title: values.title.trim(),
        description: values.description?.trim() || '',
        priority: values.priority,
        status: values.status || 'TODO',
        assignee: values.assignee,
        deadline: values.deadline ? values.deadline.toDate() : null,
        tags: values.tags || [],
        createdAt: ticket?.createdAt || new Date(),
      };

      onSave(updatedTicket);
      setIsSaving(false);
    } catch (error) {
      setIsSaving(false);
      setValidationErrors([error instanceof Error ? error.message : 'Save failed']);
    }
  };

  const handleAddTag = () => {
    const newTag = newTagInput.trim();
    if (newTag && !tagOptions.includes(newTag)) {
        setTagOptions([...tagOptions, newTag]);
    }
    if (newTag) {
        const currentTags = form.getFieldValue('tags') || [];
        if (!currentTags.includes(newTag)) {
            form.setFieldValue('tags', [...currentTags, newTag]);
        }
    }
    setNewTagInput('');
  };

  return (
    <Modal
      title={
        <Space>
          <Text strong>{mode === 'create' ? 'Create New Ticket' : 'Edit Ticket'}</Text>
        </Space>
      }
      open={isOpen}
      onCancel={onCancel}
      width={600}
      footer={null}
      maskClosable={!isSaving && !isValidating}
      keyboard={!isSaving && !isValidating}
      styles={{ body: { overflowY: 'auto', maxHeight: 'calc(100vh - 400px)' } }}
     
    >
      <div>
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert
            message="Validation Errors"
            description={
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            }
            type="error"
            showIcon
            style={{ marginBottom: '16px' }}
            closable
            onClose={() => setValidationErrors([])}
          />
        )}

        {/* Loading Overlay */}
        {(isSaving || isValidating) && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <Space direction="vertical" align="center">
              <Spin 
                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                size="large"
              />
              <Text>
                {isValidating ? 'Validating form...' : 'Saving ticket...'}
              </Text>
            </Space>
          </div>
        )}

        <Form
          form={form}
          layout="vertical"
          size="large"
        >
          {/* Title */}
          <Form.Item
            label="Title"
            name="title"
            required
            validateStatus={fieldErrors.title ? 'error' : ''}
            help={fieldErrors.title}
          >
            <Input 
              placeholder="Enter ticket title"
              maxLength={100}
              showCount
              disabled={isSaving || isValidating}
            />
          </Form.Item>

          {/* Description */}
          <Form.Item
            label="Description"
            name="description"
          >
            <TextArea
              placeholder="Enter ticket description"
              rows={4}
              maxLength={500}
              showCount
              disabled={isSaving || isValidating}
            />
          </Form.Item>

          {/* Priority and Status Row */}
          <div style={{ display: 'flex', gap: '16px' }}>
            <Form.Item
              label="Priority"
              name="priority"
              style={{ flex: 1 }}
              required
              validateStatus={fieldErrors.priority ? 'error' : ''}
              help={fieldErrors.priority}
            >
              <Select 
                placeholder="Select priority"
                disabled={isSaving || isValidating}
              >
                {PRIORITY_OPTIONS.map(priority => (
                  <Option key={priority} value={priority}>
                    <Space>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: priority === 'High' ? '#ff4d4f' : 
                                  priority === 'Medium' ? '#fa8c16' : '#52c41a'
                      }} />
                      {priority}
                    </Space>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              style={{ flex: 1 }}
            >
              <Select 
                placeholder="Select status"
                disabled={isSaving || isValidating}
              >
                {STATUS_OPTIONS.map(status => (
                  <Option key={status} value={status}>
                    {status}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Assignee */}
          <Form.Item
            label="Assignee"
            name="assignee"
            required
            validateStatus={fieldErrors.assignee ? 'error' : ''}
            help={fieldErrors.assignee}
          >
            <Select 
              placeholder="Select assignee"
              disabled={isSaving || isValidating}
            >
              <Option value="Alice Johnson">Alice Johnson</Option>
              <Option value="Bob Smith">Bob Smith</Option>
              <Option value="Carol Davis">Carol Davis</Option>
              <Option value="David Wilson">David Wilson</Option>
              <Option value="Eve Brown">Eve Brown</Option>
            </Select>
          </Form.Item>

          {/* Deadline */}
          <Form.Item
            label="Deadline"
            name="deadline"
          >
            <DatePicker
              style={{ width: '100%' }}
              placeholder="Select deadline"
              format="YYYY-MM-DD"
              disabledDate={(current: Dayjs) => current && current < dayjs().startOf('day')}
              disabled={isSaving || isValidating}
            />
          </Form.Item>

          {/* Tags */}
          <Form.Item
            label="Tags"
            name="tags"
          >
            <Select
              mode="tags"
              placeholder="Add tags"
              tokenSeparators={[',']}
              options={tagOptions.map(tag => ({
                value: tag,
                label: tag
              }))}
              onOpenChange={(open: boolean) => {
                if (!open) {
                  setNewTagInput('');
                }
              }}
              dropdownRender={(menu: React.ReactNode) => (
                <>
                  {menu}
                  <Divider style={{ margin: '8px 0' }} />
                  <Space style={{ padding: '0 8px 4px' }}>
                    <Input
                      placeholder="Add new tag"
                      value={newTagInput}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTagInput(e.target.value)}
                      onPressEnter={handleAddTag}
                    />
                    <Button icon={<PlusOutlined />} onClick={handleAddTag}>
                      Add
                    </Button>
                  </Space>
                </>
              )}
            />
          </Form.Item>
        </Form>

        <Divider />

        {/* Footer Actions */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: '8px' 
        }}>
          <Button 
            onClick={onCancel}
            disabled={isSaving || isValidating}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={handleSave}
            loading={isSaving}
            disabled={isValidating}
          >
            {mode === 'create' ? 'Create Ticket' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}; 