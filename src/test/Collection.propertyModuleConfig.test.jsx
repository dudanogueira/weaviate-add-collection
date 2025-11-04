import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PropertyItem from '../components/PropertyItem'

describe('Collection - Property ModuleConfig', () => {
  it('should show vectorization settings for text properties', () => {
    const mockProperty = {
      name: 'description',
      dataType: 'text',
      description: 'A text field',
      indexFilterable: true,
      indexSearchable: true,
      tokenization: 'word'
    }

    const onChange = () => {}
    const onDelete = () => {}

    render(
      <PropertyItem
        value={mockProperty}
        onChange={onChange}
        onDelete={onDelete}
        index={0}
      />
    )

    // Should see vectorization settings for text properties
    expect(screen.queryByText('Vectorize Property Name')).toBeTruthy()
    expect(screen.queryByText(/Include the property name itself when creating embeddings/i)).toBeTruthy()
  })

  it('should not show vectorization settings for non-text properties', () => {
    const mockProperty = {
      name: 'age',
      dataType: 'int',
      description: 'An integer field',
      indexFilterable: true,
      indexRangeFilters: false
    }

    const onChange = () => {}
    const onDelete = () => {}

    render(
      <PropertyItem
        value={mockProperty}
        onChange={onChange}
        onDelete={onDelete}
        index={0}
      />
    )

    // Should NOT see vectorization settings for non-text properties
    expect(screen.queryByText('Vectorize Property Name')).toBeFalsy()
  })

  it('should render vectorize property name unchecked by default', () => {
    const mockProperty = {
      name: 'title',
      dataType: 'text',
      description: 'A title field',
      indexFilterable: true,
      indexSearchable: true,
      tokenization: 'word'
    }

    const onChange = () => {}
    const onDelete = () => {}

    const { container } = render(
      <PropertyItem
        value={mockProperty}
        onChange={onChange}
        onDelete={onDelete}
        index={0}
      />
    )

    const checkboxes = container.querySelectorAll('input[type="checkbox"]')
    const vectorizeNameCheckbox = Array.from(checkboxes).find(cb => {
      const label = cb.closest('label')
      return label && label.textContent.includes('Vectorize Property Name')
    })
    expect(vectorizeNameCheckbox).toBeTruthy()
    expect(vectorizeNameCheckbox.checked).toBe(false)
  })
})
