import weaviate from 'weaviate-client'

/**
 * Get a Weaviate client connected to localhost
 */
export async function getWeaviateClient() {
  const client = await weaviate.connectToLocal()
  return client
}

/**
 * Create a collection in Weaviate from a JSON schema
 */
export async function createCollection(client, collectionJson) {
  // Convert the JSON format (with 'class' field) to Weaviate v4 client format
  const collectionName = collectionJson.class
  
  // Build the collection creation config
  const config = {
    name: collectionName,
    description: collectionJson.description,
  }
  
  // Add properties if they exist
  if (collectionJson.properties && Array.isArray(collectionJson.properties)) {
    config.properties = collectionJson.properties.map(prop => {
      const baseDataType = Array.isArray(prop.dataType) ? prop.dataType[0] : prop.dataType
      const cleanDataType = baseDataType.replace('[]', '')
      
      const propConfig = {
        name: prop.name,
        dataType: baseDataType,
        description: prop.description,
        indexFilterable: prop.indexFilterable,
      }
      
      // Only add indexSearchable and tokenization for text types
      if (cleanDataType === 'text' && prop.indexSearchable !== undefined) {
        propConfig.indexSearchable = prop.indexSearchable
      }
      
      if (cleanDataType === 'text' && prop.tokenization) {
        propConfig.tokenization = prop.tokenization
      }
      
      // Only add indexRangeFilters for numeric and date types
      if (['int', 'number', 'date'].includes(cleanDataType) && prop.indexRangeFilters !== undefined) {
        propConfig.indexRangeFilters = prop.indexRangeFilters
      }
      
      return propConfig
    })
  }
  
  // Add vectorConfig if it exists
  if (collectionJson.vectorConfig) {
    const vectorConfigs = Object.entries(collectionJson.vectorConfig)
    
    // For now, only handle 'none' vectorizer and simple configs
    // This is because the Weaviate v4 client has a different API for vectorizers
    if (vectorConfigs.length > 0) {
      const [name, vectorConfig] = vectorConfigs[0]
      const vectorizerName = Object.keys(vectorConfig.vectorizer)[0]
      
      // Only handle 'none' vectorizer for simplicity in tests
      if (vectorizerName === 'none') {
        config.vectorizers = weaviate.configure.vectorizer.none([name])
      }
      // You can add more vectorizer types here as needed
    }
  }
  
  const collection = await client.collections.create(config)
  return collection
}

/**
 * Get a collection from Weaviate
 */
export async function getCollection(client, collectionName) {
  return client.collections.get(collectionName)
}

/**
 * Delete a collection from Weaviate if it exists
 */
export async function deleteCollection(client, collectionName) {
  try {
    await client.collections.delete(collectionName)
  } catch (error) {
    // Ignore if collection doesn't exist
    if (!error.message.includes('not found')) {
      throw error
    }
  }
}

/**
 * Export collection schema from Weaviate
 */
export async function exportCollectionSchema(client, collectionName) {
  const collection = await client.collections.get(collectionName)
  const config = await collection.config.get()
  
  // Convert Weaviate config back to our JSON format
  const schema = {
    class: config.name,
    name: config.name, // Also add 'name' for Component compatibility
    description: config.description || '',
  }
  
  // Add properties
  if (config.properties && config.properties.length > 0) {
    schema.properties = config.properties.map(prop => {
      const cleanDataType = prop.dataType.replace('[]', '')
      
      const propertyConfig = {
        name: prop.name,
        dataType: [prop.dataType],
        description: prop.description || '',
        indexFilterable: prop.indexFilterable ?? true,
      }
      
      // Only add indexSearchable and tokenization for text types
      if (cleanDataType === 'text') {
        propertyConfig.indexSearchable = prop.indexSearchable ?? true
        propertyConfig.tokenization = prop.tokenization || 'word'
      } else {
        propertyConfig.indexSearchable = false
      }
      
      // Only add indexRangeFilters for numeric and date types
      if (['int', 'number', 'date'].includes(cleanDataType)) {
        propertyConfig.indexRangeFilters = prop.indexRangeFilters ?? false
      } else {
        propertyConfig.indexRangeFilters = false
      }
      
      return propertyConfig
    })
  }
  
  // Add vectorConfig - Weaviate v4 client uses 'vectorizers' array
  if (config.vectorizers && Array.isArray(config.vectorizers)) {
    schema.vectorConfig = {}
    config.vectorizers.forEach((vectorizer) => {
      const vecName = vectorizer.name || 'default'
      const vecIndexType = vectorizer.indexType || 'hnsw'
      const vecConfig = vectorizer.vectorizer || {}
      
      // Extract vectorizer type and config
      let vectorizerType = 'none'
      let vectorizerConfig = {}
      
      if (typeof vecConfig === 'object' && vecConfig !== null) {
        // The vectorizer object might have a type property or be structured differently
        vectorizerType = vecConfig.name || vecConfig.type || 'none'
        vectorizerConfig = vecConfig.config || {}
      }
      
      schema.vectorConfig[vecName] = {
        vectorizer: {
          [vectorizerType]: vectorizerConfig
        },
        vectorIndexType: vecIndexType,
      }
      
      if (vectorizer.indexConfig) {
        schema.vectorConfig[vecName].vectorIndexConfig = vectorizer.indexConfig
      }
      
      if (vectorizer.quantizer) {
        schema.vectorConfig[vecName].quantizer = vectorizer.quantizer
      }
    })
  } else if (config.vectorConfig) {
    // Fallback: try the old structure
    schema.vectorConfig = {}
    Object.entries(config.vectorConfig).forEach(([name, vectorConfig]) => {
      const vectorizerName = Object.keys(vectorConfig.vectorizer)[0]
      const vectorizerConfig = vectorConfig.vectorizer[vectorizerName]
      
      schema.vectorConfig[name] = {
        vectorizer: {
          [vectorizerName]: vectorizerConfig
        },
        vectorIndexType: vectorConfig.vectorIndexType,
      }
      
      if (vectorConfig.vectorIndexConfig) {
        schema.vectorConfig[name].vectorIndexConfig = vectorConfig.vectorIndexConfig
      }
      
      if (vectorConfig.quantizer) {
        schema.vectorConfig[name].quantizer = vectorConfig.quantizer
      }
    })
  }
  
  return schema
}
