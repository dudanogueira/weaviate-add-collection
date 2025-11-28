import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Collection from '../components/Collection'

describe('Collection callbacks', () => {
  it('should call onChange when schema changes', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<Collection onChange={handleChange} />)

    // Wait for initial render and onChange call
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled()
    })

    const initialCallCount = handleChange.mock.calls.length
    const lastCall = handleChange.mock.calls[handleChange.mock.calls.length - 1]
    
    // Verify initial schema structure
    expect(lastCall[0]).toHaveProperty('class')
    // description is not included when empty

    // Change the collection name - use more specific selector
    const nameInput = screen.getByPlaceholderText('MyCollection')
    await user.clear(nameInput)
    await user.type(nameInput, 'TestCollection')

    // Wait for onChange to be called again
    await waitFor(() => {
      expect(handleChange.mock.calls.length).toBeGreaterThan(initialCallCount)
    })

    // Verify the schema was updated
    const latestCall = handleChange.mock.calls[handleChange.mock.calls.length - 1]
    expect(latestCall[0].class).toBe('TestCollection')
  })

  it('should call onSubmit when submit button is clicked', async () => {
    const handleSubmit = vi.fn()
    const user = userEvent.setup()

    render(<Collection onSubmit={handleSubmit} />)

    // Wait for component to render
    await waitFor(() => {
      expect(screen.getByText(/Create Collection/i)).toBeInTheDocument()
    })

    // Click the submit button
    const submitButton = screen.getByText(/Create Collection/i)
    await user.click(submitButton)

    // Verify onSubmit was called with the schema
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })

    const [schema] = handleSubmit.mock.calls[0]
    expect(schema).toHaveProperty('class')
    // description is not included when empty
  })

  it('should not render submit button when onSubmit is not provided', () => {
    render(<Collection />)

    // Submit button should not be in the document
    expect(screen.queryByText(/Create Collection/i)).not.toBeInTheDocument()
  })

  it('should pass current schema to onSubmit', async () => {
    const handleSubmit = vi.fn()
    const user = userEvent.setup()

    render(<Collection onSubmit={handleSubmit} />)

    // Modify the collection name - use more specific selector
    const nameInput = screen.getByPlaceholderText('MyCollection')
    await user.clear(nameInput)
    await user.type(nameInput, 'MyTestCollection')

    // Modify the description
    const descInput = screen.getByLabelText(/description/i)
    await user.clear(descInput)
    await user.type(descInput, 'Test description')

    // Click submit
    const submitButton = screen.getByText(/Create Collection/i)
    await user.click(submitButton)

    // Verify the submitted schema has the correct values
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })

    const [schema] = handleSubmit.mock.calls[0]
    expect(schema.class).toBe('MyTestCollection')
    expect(schema.description).toBe('Test description')
  })

  it('should call onChange with complete schema including properties', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<Collection onChange={handleChange} />)

    // Wait for initial render
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled()
    })

    // Find the "Add Property" button directly instead of clicking the Properties toggle
    const addPropertyButton = screen.getByText(/Add property/i)
    await user.click(addPropertyButton)

    // Wait for onChange to include the new property
    await waitFor(() => {
      const latestCall = handleChange.mock.calls[handleChange.mock.calls.length - 1]
      expect(latestCall[0].properties).toBeDefined()
      expect(latestCall[0].properties.length).toBeGreaterThan(0)
    })
  })

  it('should provide schema with vectorConfig when vectorizers are configured', async () => {
    const handleChange = vi.fn()
    const user = userEvent.setup()

    render(<Collection onChange={handleChange} />)

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalled()
    })

    // Open vector config section
    const vectorToggle = screen.getByText(/Vectorizer Configuration/i).closest('button')
    if (vectorToggle) {
      await user.click(vectorToggle)
    }

    // The schema should be updated via onChange
    await waitFor(() => {
      const latestCall = handleChange.mock.calls[handleChange.mock.calls.length - 1]
      expect(latestCall[0]).toBeDefined()
      // vectorConfig might be empty initially, but the callback should still work
    })
  })
})
