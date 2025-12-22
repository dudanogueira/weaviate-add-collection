import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Collection from '../components/Collection'

describe('Collection Name Validation', () => {
  it('should show error when collection name starts with lowercase', async () => {
    const user = userEvent.setup()
    render(<Collection />)
    
    const nameInput = screen.getByLabelText(/Collection Name/i)
    await user.type(nameInput, 'myCollection')
    
    await waitFor(() => {
      expect(screen.getByText(/must start with an uppercase letter/i)).toBeInTheDocument()
    })
  })

  it('should show success message for valid collection name', async () => {
    const user = userEvent.setup()
    render(<Collection />)
    
    const nameInput = screen.getByLabelText(/Collection Name/i)
    await user.type(nameInput, 'MyCollection')
    
    await waitFor(() => {
      expect(screen.getByText(/Valid collection name/i)).toBeInTheDocument()
    })
  })

  it('should auto-sanitize invalid name on blur', async () => {
    const user = userEvent.setup()
    render(<Collection />)
    
    const nameInput = screen.getByLabelText(/Collection Name/i)
    await user.type(nameInput, 'myCollection')
    await user.tab() // Trigger blur
    
    await waitFor(() => {
      expect(nameInput.value).toBe('MyCollection')
    })
  })

  it('should show error for names starting with numbers', async () => {
    const user = userEvent.setup()
    render(<Collection />)
    
    const nameInput = screen.getByLabelText(/Collection Name/i)
    await user.type(nameInput, '123Collection')
    
    await waitFor(() => {
      expect(screen.getByText(/must start with an uppercase letter/i)).toBeInTheDocument()
    })
  })

  it('should accept valid names with underscores and numbers', async () => {
    const user = userEvent.setup()
    render(<Collection />)
    
    const nameInput = screen.getByLabelText(/Collection Name/i)
    await user.type(nameInput, 'My_Collection_123')
    
    await waitFor(() => {
      expect(screen.getByText(/Valid collection name/i)).toBeInTheDocument()
    })
  })

  it('should show error for names with invalid characters', async () => {
    const user = userEvent.setup()
    render(<Collection />)
    
    const nameInput = screen.getByLabelText(/Collection Name/i)
    await user.type(nameInput, 'My-Collection')
    
    await waitFor(() => {
      expect(screen.getByText(/must start with an uppercase letter/i)).toBeInTheDocument()
    })
  })

  it('should auto-correct names with spaces to CamelCase on blur', async () => {
    const user = userEvent.setup()
    render(<Collection />)
    
    const nameInput = screen.getByLabelText(/Collection Name/i)
    await user.type(nameInput, 'some test here')
    await user.tab()
    
    await waitFor(() => {
      expect(nameInput.value).toBe('SomeTestHere')
    })
  })

  it('should accept single uppercase letter as valid name', async () => {
    const user = userEvent.setup()
    render(<Collection />)
    
    const nameInput = screen.getByLabelText(/Collection Name/i)
    await user.type(nameInput, 'A')
    
    await waitFor(() => {
      expect(screen.getByText(/Valid collection name/i)).toBeInTheDocument()
    })
  })
})
