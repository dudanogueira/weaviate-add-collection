import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Collection from '../components/Collection'

describe('Collection - Object DataType with Nested Properties', () => {
  let container

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    document.body.removeChild(container)
    container = null
  })

  it('should allow creating a property with object datatype', async () => {
    const user = userEvent.setup()
    let capturedJson = {}
    
    const { container: renderedContainer } = render(
      <Collection 
        onChange={(json) => { capturedJson = json }}
      />
    )

    // Find the first property's datatype select
    const dataTypeSelects = renderedContainer.querySelectorAll('.data-type-select')
    const firstDataTypeSelect = dataTypeSelects[0]
    
    // Change to object type
    await user.selectOptions(firstDataTypeSelect, 'object')
    
    await waitFor(() => {
      expect(capturedJson.properties).toBeDefined()
      expect(capturedJson.properties[0].dataType).toEqual(['object'])
    })
  })

  it('should display nested properties section when object type is selected', async () => {
    const user = userEvent.setup()
    
    const { container: renderedContainer } = render(<Collection />)

    // Find and change first property to object type
    const dataTypeSelects = renderedContainer.querySelectorAll('.data-type-select')
    await user.selectOptions(dataTypeSelects[0], 'object')
    
    // Should show nested properties section
    await waitFor(() => {
      const nestedSections = renderedContainer.querySelectorAll('.nested-property-section')
      expect(nestedSections.length).toBeGreaterThan(0)
      expect(screen.getByText(/Add nested property/i)).toBeInTheDocument()
    })
  })

  it('should allow adding nested properties to an object property', async () => {
    const user = userEvent.setup()
    let capturedJson = {}
    
    const { container: renderedContainer } = render(
      <Collection 
        onChange={(json) => { capturedJson = json }}
      />
    )

    // Change first property to object type
    const dataTypeSelects = renderedContainer.querySelectorAll('.data-type-select')
    await user.selectOptions(dataTypeSelects[0], 'object')
    
    // Add a nested property
    const addNestedButton = await screen.findByText(/Add nested property/i)
    await user.click(addNestedButton)
    
    await waitFor(() => {
      expect(capturedJson.properties[0].nestedProperties).toBeDefined()
      expect(capturedJson.properties[0].nestedProperties.length).toBeGreaterThan(0)
    })
  })

  it('should support recursive nesting - nested object with its own nested properties', async () => {
    // Test using JSON import instead of UI interaction for reliability
    const testJson = {
      class: 'RecursiveTest',
      properties: [
        {
          name: 'parent',
          dataType: ['object'],
          nestedProperties: [
            {
              name: 'child',
              dataType: ['object'],
              nestedProperties: [
                {
                  name: 'grandchild',
                  dataType: ['text']
                }
              ]
            }
          ]
        }
      ]
    }

    let capturedJson = {}
    render(
      <Collection 
        initialJson={testJson}
        onChange={(json) => { capturedJson = json }}
      />
    )

    // Verify the recursive structure is preserved
    await waitFor(() => {
      const props = capturedJson.properties
      expect(props).toBeDefined()
      expect(props[0].name).toBe('parent')
      expect(props[0].dataType).toEqual(['object'])
      expect(props[0].nestedProperties).toBeDefined()
      expect(props[0].nestedProperties.length).toBe(1)
      
      // Check child
      expect(props[0].nestedProperties[0].name).toBe('child')
      expect(props[0].nestedProperties[0].dataType).toEqual(['object'])
      expect(props[0].nestedProperties[0].nestedProperties).toBeDefined()
      expect(props[0].nestedProperties[0].nestedProperties.length).toBe(1)
      
      // Check grandchild
      expect(props[0].nestedProperties[0].nestedProperties[0].name).toBe('grandchild')
      expect(props[0].nestedProperties[0].nestedProperties[0].dataType).toEqual(['text'])
    })
  })

  it('should correctly import a collection with nested object properties', async () => {
    const testJson = {
      class: 'TestNestedObject',
      properties: [
        {
          name: 'nested',
          dataType: ['object'],
          indexFilterable: true,
          indexSearchable: false,
          nestedProperties: [
            {
              name: 'text',
              dataType: ['text'],
              indexFilterable: true,
              indexSearchable: true,
              tokenization: 'word'
            },
            {
              name: 'child',
              dataType: ['object'],
              indexFilterable: true,
              indexSearchable: false,
              nestedProperties: [
                {
                  name: 'number',
                  dataType: ['number'],
                  indexFilterable: true,
                  indexSearchable: false
                }
              ]
            }
          ]
        }
      ]
    }

    let capturedJson = {}
    render(
      <Collection 
        initialJson={testJson}
        onChange={(json) => { capturedJson = json }}
      />
    )

    await waitFor(() => {
      expect(capturedJson.properties).toBeDefined()
      expect(capturedJson.properties[0].name).toBe('nested')
      expect(capturedJson.properties[0].dataType).toEqual(['object'])
      expect(capturedJson.properties[0].nestedProperties).toBeDefined()
      expect(capturedJson.properties[0].nestedProperties.length).toBe(2)
      
      // Check first nested property (text)
      expect(capturedJson.properties[0].nestedProperties[0].name).toBe('text')
      expect(capturedJson.properties[0].nestedProperties[0].dataType).toEqual(['text'])
      
      // Check second nested property (child object)
      expect(capturedJson.properties[0].nestedProperties[1].name).toBe('child')
      expect(capturedJson.properties[0].nestedProperties[1].dataType).toEqual(['object'])
      expect(capturedJson.properties[0].nestedProperties[1].nestedProperties).toBeDefined()
      expect(capturedJson.properties[0].nestedProperties[1].nestedProperties.length).toBe(1)
      
      // Check deeply nested property (number)
      expect(capturedJson.properties[0].nestedProperties[1].nestedProperties[0].name).toBe('number')
      expect(capturedJson.properties[0].nestedProperties[1].nestedProperties[0].dataType).toEqual(['number'])
    })
  })

  it('should correctly export nested object properties to JSON', async () => {
    const user = userEvent.setup()
    let capturedJson = {}
    
    const { container: renderedContainer } = render(
      <Collection 
        onChange={(json) => { capturedJson = json }}
      />
    )

    // Set up first property as object - use more specific placeholder
    const firstPropertyInput = screen.getByPlaceholderText('new_property1')
    await user.clear(firstPropertyInput)
    await user.type(firstPropertyInput, 'nested')
    
    const dataTypeSelects = renderedContainer.querySelectorAll('.data-type-select')
    await user.selectOptions(dataTypeSelects[0], 'object')
    
    // Wait for nested properties section to appear
    await waitFor(() => {
      const nestedSections = renderedContainer.querySelectorAll('.nested-property-section')
      expect(nestedSections.length).toBeGreaterThan(0)
    })
    
    // Add first nested property
    const addNestedButtons = screen.getAllByText(/Add nested property/i)
    await user.click(addNestedButtons[0])
    
    // Verify nested property was added
    await waitFor(() => {
      expect(capturedJson.properties).toBeDefined()
      expect(capturedJson.properties[0].name).toBe('nested')
      expect(capturedJson.properties[0].dataType).toEqual(['object'])
      expect(capturedJson.properties[0].nestedProperties).toBeDefined()
      expect(capturedJson.properties[0].nestedProperties.length).toBeGreaterThan(0)
    })
  })

  it('should not allow array checkbox for object properties when using dataType array format', async () => {
    const user = userEvent.setup()
    let capturedJson = {}
    
    const { container: renderedContainer } = render(
      <Collection 
        onChange={(json) => { capturedJson = json }}
      />
    )

    // Change to object type
    const dataTypeSelects = renderedContainer.querySelectorAll('.data-type-select')
    await user.selectOptions(dataTypeSelects[0], 'object')
    
    // Check the array checkbox
    const arrayCheckboxes = screen.getAllByLabelText(/array/i)
    await user.click(arrayCheckboxes[0])
    
    await waitFor(() => {
      expect(capturedJson.properties[0].dataType).toEqual(['object[]'])
    })
  })
})
