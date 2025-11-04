import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import VectorConfigItem from '../components/VectorConfigItem'

describe('VectorConfigItem - Property Vectorization', () => {
  it('should only show text properties for vectorization', () => {
    const properties = [
      { name: 'textField1', dataType: 'text', description: 'A text field' },
      { name: 'textField2', dataType: 'text', description: 'Another text field' },
      { name: 'numberField', dataType: 'number', description: 'A number field' },
      { name: 'booleanField', dataType: 'boolean', description: 'A boolean field' },
      { name: 'dateField', dataType: 'date', description: 'A date field' },
      { name: 'intField', dataType: 'int', description: 'An int field' }
    ]

    const vectorConfig = {
      name: 'default',
      vectorizer: 'text2vec-openai',
      indexType: 'hnsw',
      moduleConfig: {}
    }

    const onChange = vi.fn()
    const onDelete = vi.fn()

    render(
      <VectorConfigItem
        value={vectorConfig}
        onChange={onChange}
        onDelete={onDelete}
        index={0}
        properties={properties}
      />
    )

    // Open the properties section by looking for checkboxes
    const checkboxes = screen.queryAllByRole('checkbox')
    
    // Find the text field checkboxes (should only be 2 text fields visible)
    const textFieldLabels = screen.queryByText('textField1')
    expect(textFieldLabels).toBeTruthy()
    
    const textField2Labels = screen.queryByText('textField2')
    expect(textField2Labels).toBeTruthy()

    // Non-text fields should not be visible
    const numberFieldLabels = screen.queryByText('numberField')
    expect(numberFieldLabels).toBeFalsy()
    
    const booleanFieldLabels = screen.queryByText('booleanField')
    expect(booleanFieldLabels).toBeFalsy()
    
    const dateFieldLabels = screen.queryByText('dateField')
    expect(dateFieldLabels).toBeFalsy()
    
    const intFieldLabels = screen.queryByText('intField')
    expect(intFieldLabels).toBeFalsy()
  })

  it('should show message when no text properties are available', () => {
    const properties = [
      { name: 'numberField', dataType: 'number', description: 'A number field' },
      { name: 'booleanField', dataType: 'boolean', description: 'A boolean field' }
    ]

    const vectorConfig = {
      name: 'default',
      vectorizer: 'text2vec-openai',
      indexType: 'hnsw',
      moduleConfig: {}
    }

    const onChange = vi.fn()
    const onDelete = vi.fn()

    render(
      <VectorConfigItem
        value={vectorConfig}
        onChange={onChange}
        onDelete={onDelete}
        index={0}
        properties={properties}
      />
    )

    // Should show the "no text properties" message
    const message = screen.getByText(/No text properties available/i)
    expect(message).toBeTruthy()
  })

  it('should only select text properties when "Select All" is clicked', () => {
    const properties = [
      { name: 'textField1', dataType: 'text', description: 'A text field' },
      { name: 'textField2', dataType: 'text', description: 'Another text field' },
      { name: 'numberField', dataType: 'number', description: 'A number field' },
      { name: 'intField', dataType: 'int', description: 'An int field' }
    ]

    const vectorConfig = {
      name: 'default',
      vectorizer: 'text2vec-openai',
      indexType: 'hnsw',
      moduleConfig: {}
    }

    const onChange = vi.fn()
    const onDelete = vi.fn()

    render(
      <VectorConfigItem
        value={vectorConfig}
        onChange={onChange}
        onDelete={onDelete}
        index={0}
        properties={properties}
      />
    )

    // Click the "Select All" button
    const selectAllButton = screen.getByText('Select All')
    fireEvent.click(selectAllButton)

    // Verify that only text properties were selected
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        moduleConfig: expect.objectContaining({
          properties: expect.arrayContaining(['textField1', 'textField2'])
        })
      })
    )

    // The call should have exactly 2 properties (only text fields)
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    expect(lastCall.moduleConfig.properties).toHaveLength(2)
    expect(lastCall.moduleConfig.properties).toContain('textField1')
    expect(lastCall.moduleConfig.properties).toContain('textField2')
    expect(lastCall.moduleConfig.properties).not.toContain('numberField')
    expect(lastCall.moduleConfig.properties).not.toContain('intField')
  })

  it('should update hint text to indicate only text properties can be vectorized', () => {
    const properties = [
      { name: 'textField1', dataType: 'text', description: 'A text field' }
    ]

    const vectorConfig = {
      name: 'default',
      vectorizer: 'text2vec-openai',
      indexType: 'hnsw',
      moduleConfig: {}
    }

    const onChange = vi.fn()
    const onDelete = vi.fn()

    render(
      <VectorConfigItem
        value={vectorConfig}
        onChange={onChange}
        onDelete={onDelete}
        index={0}
        properties={properties}
      />
    )

    // Check that the hint text mentions "only text properties"
    const hintText = screen.getByText(/Only text properties can be vectorized/i)
    expect(hintText).toBeTruthy()
  })
})
