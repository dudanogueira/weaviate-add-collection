import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Collection from '../components/Collection'
import { 
  getWeaviateClient, 
  createCollection, 
  deleteCollection 
} from './weaviateHelper'

describe('Collection Component - Create Collection Test', () => {
  let client
  const testCollectionName = 'TestCollection'

  beforeAll(async () => {
    // Connect to Weaviate
    client = await getWeaviateClient()
    
    // Clean up any existing test collection
    await deleteCollection(client, testCollectionName)
  })

  afterAll(async () => {
    // Clean up after tests
    if (client) {
      await deleteCollection(client, testCollectionName)
      client.close()
    }
  })

  it('should create a collection in Weaviate from form input', async () => {
    const user = userEvent.setup()

    // Render the Collection component
    const { container } = render(<Collection />)

    // Find and fill the name field (using placeholder since labels don't have htmlFor)
    const nameInput = screen.getByPlaceholderText('MyCollection')
    await user.clear(nameInput)
    await user.type(nameInput, testCollectionName)

    // Find and fill the description field
    const descriptionInput = screen.getByPlaceholderText('A Brand new collection')
    await user.clear(descriptionInput)
    await user.type(descriptionInput, 'This is a test collection created from the form')

    // First, make sure Properties section is open
    const propertiesButton = screen.getByRole('button', { name: /properties/i })
    if (propertiesButton.getAttribute('aria-expanded') === 'false') {
      await user.click(propertiesButton)
    }

    // Fill in the default property that already exists
    // Find the first property name input using placeholder
    const propertyNameInputs = container.querySelectorAll('input[placeholder^="new_property"]')
    if (propertyNameInputs.length > 0) {
      await user.clear(propertyNameInputs[0])
      await user.type(propertyNameInputs[0], 'title')
    }

    // Wait for JSON to be generated
    await waitFor(() => {
      const jsonBlock = container.querySelector('.json-block')
      expect(jsonBlock).toBeTruthy()
      expect(jsonBlock.textContent).toContain(testCollectionName)
    })

    // Get the generated JSON from the preview
    const jsonBlock = container.querySelector('.json-block')
    const generatedJson = JSON.parse(jsonBlock.textContent)

    // Verify the JSON structure
    expect(generatedJson).toHaveProperty('class', testCollectionName)
    expect(generatedJson).toHaveProperty('description', 'This is a test collection created from the form')
    expect(generatedJson).toHaveProperty('properties')
    expect(generatedJson.properties).toHaveLength(1)
    expect(generatedJson.properties[0]).toHaveProperty('name', 'title')

    // Now create the collection in Weaviate using the generated JSON
    const collection = await createCollection(client, generatedJson)
    
    // Verify the collection was created
    expect(collection).toBeTruthy()
    
    // Fetch the collection from Weaviate to verify it exists
    const fetchedCollection = await client.collections.get(testCollectionName)
    const config = await fetchedCollection.config.get()
    
    expect(config.name).toBe(testCollectionName)
    expect(config.description).toBe('This is a test collection created from the form')
    expect(config.properties).toHaveLength(1)
    expect(config.properties[0].name).toBe('title')
  })
})
