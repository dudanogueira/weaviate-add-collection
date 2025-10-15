/**
 * This utility extracts configuration options for vectorizer modules
 * directly from the Weaviate client TypeScript definitions.
 * 
 * It dynamically infers the available configuration fields for each
 * vectorizer module based on the TypeScript type definitions.
 */

// Import all vectorizer config types from weaviate-client
// These are the actual type definitions from the library
//import weaviate from 'weaviate-client'

/**
 * Type definitions mapping for each vectorizer module.
 * This is extracted from weaviate-client/dist/node/esm/collections/config/types/vectorizer.d.ts
 */
const VECTORIZER_CONFIG_FIELDS = {
  'img2vec-neural': {
    fields: [
      { name: 'imageFields', type: 'string[]', required: true, description: 'The image fields used when vectorizing. Must match BLOB property fields.' }
    ]
  },
  'multi2vec-nvidia': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use. Defaults to server-defined default.' },
      { name: 'baseURL', type: 'string', description: 'The base URL where API requests should go.' },
      { name: 'truncation', type: 'boolean', description: 'Whether to apply truncation.' },
      { name: 'output_encoding', type: 'string', description: 'Format in which the embeddings are encoded.' },
      { name: 'imageFields', type: 'string[]', description: 'The image fields used when vectorizing.' },
      { name: 'textFields', type: 'string[]', description: 'The text fields used when vectorizing.' },
      { name: 'weights', type: 'object', description: 'The weights of the fields used for vectorization.' }
    ]
  },
  'multi2vec-aws': {
    fields: [
      { name: 'dimensions', type: 'number', description: 'The dimensionality of the vector once embedded.' },
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'region', type: 'string', description: 'The AWS region where the model runs.' },
      { name: 'imageFields', type: 'string[]', description: 'The image fields used when vectorizing.' },
      { name: 'textFields', type: 'string[]', description: 'The text fields used when vectorizing.' },
      { name: 'weights', type: 'object', description: 'The weights of the fields used for vectorization.' }
    ]
  },
  'multi2vec-clip': {
    fields: [
      { name: 'imageFields', type: 'string[]', description: 'The image fields used when vectorizing.' },
      { name: 'inferenceUrl', type: 'string', description: 'The URL where inference requests are sent.' },
      { name: 'textFields', type: 'string[]', description: 'The text fields used when vectorizing.' },
      { name: 'vectorizeCollectionName', type: 'boolean', description: 'Whether the collection name is vectorized.' },
      { name: 'weights', type: 'object', description: 'The weights of the fields used for vectorization.' }
    ]
  },
  'multi2vec-cohere': {
    fields: [
      { name: 'baseURL', type: 'string', description: 'The base URL to use where API requests should go.' },
      { name: 'imageFields', type: 'string[]', description: 'The image fields used when vectorizing.' },
      { name: 'model', type: 'string', description: 'The specific model to use.' },
      { name: 'textFields', type: 'string[]', description: 'The text fields used when vectorizing.' },
      { name: 'truncate', type: 'string', description: 'The truncation strategy to use.' },
      { name: 'vectorizeCollectionName', type: 'boolean', description: 'Whether the collection name is vectorized.' },
      { name: 'weights', type: 'object', description: 'The weights of the fields used for vectorization.' }
    ]
  },
  'multi2vec-bind': {
    fields: [
      { name: 'audioFields', type: 'string[]', description: 'The audio fields used when vectorizing.' },
      { name: 'depthFields', type: 'string[]', description: 'The depth fields used when vectorizing.' },
      { name: 'imageFields', type: 'string[]', description: 'The image fields used when vectorizing.' },
      { name: 'IMUFields', type: 'string[]', description: 'The IMU fields used when vectorizing.' },
      { name: 'textFields', type: 'string[]', description: 'The text fields used when vectorizing.' },
      { name: 'thermalFields', type: 'string[]', description: 'The thermal fields used when vectorizing.' },
      { name: 'videoFields', type: 'string[]', description: 'The video fields used when vectorizing.' },
      { name: 'vectorizeCollectionName', type: 'boolean', description: 'Whether the collection name is vectorized.' },
      { name: 'weights', type: 'object', description: 'The weights of the fields used for vectorization.' }
    ]
  },
  'multi2vec-google': {
    fields: [
      { name: 'projectId', type: 'string', required: true, description: 'The project ID of the model in GCP.' },
      { name: 'location', type: 'string', required: true, description: 'The location where the model runs.' },
      { name: 'imageFields', type: 'string[]', description: 'The image fields used when vectorizing.' },
      { name: 'textFields', type: 'string[]', description: 'The text fields used when vectorizing.' },
      { name: 'videoFields', type: 'string[]', description: 'The video fields used when vectorizing.' },
      { name: 'videoIntervalSeconds', type: 'number', description: 'Length of a video interval in seconds.' },
      { name: 'model', type: 'string', description: 'The model ID in use.' },
      { name: 'dimensions', type: 'number', description: 'The dimensionality of the vector once embedded.' },
      { name: 'vectorizeCollectionName', type: 'boolean', description: 'Whether the collection name is vectorized.' },
      { name: 'weights', type: 'object', description: 'The weights of the fields used for vectorization.' }
    ]
  },
  'multi2vec-jinaai': {
    fields: [
      { name: 'imageFields', type: 'string[]', description: 'The image fields used when vectorizing.' },
      { name: 'textFields', type: 'string[]', description: 'The text fields used when vectorizing.' },
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'baseURL', type: 'string', description: 'The base URL where API requests should go.' }
    ]
  },
  'multi2vec-voyageai': {
    fields: [
      { name: 'imageFields', type: 'string[]', description: 'The image fields used when vectorizing.' },
      { name: 'textFields', type: 'string[]', description: 'The text fields used when vectorizing.' },
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'baseURL', type: 'string', description: 'The base URL where API requests should go.' }
    ]
  },
  'ref2vec-centroid': {
    fields: [
      { name: 'referenceProperties', type: 'string[]', required: true, description: 'The reference properties to use for centroid calculation.' },
      { name: 'method', type: 'string', description: 'The method to use for centroid calculation (mean).' }
    ]
  },
  'text2vec-aws': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'region', type: 'string', description: 'The AWS region where the model runs.' },
      { name: 'service', type: 'string', description: 'The AWS service to use (bedrock, sagemaker).' },
      { name: 'endpoint', type: 'string', description: 'The endpoint URL for SageMaker.' },
      { name: 'targetModel', type: 'string', description: 'The target model for Bedrock.' },
      { name: 'vectorizeClassName', type: 'boolean', description: 'Whether to vectorize the class name.' }
    ]
  },
  'text2vec-azure-openai': {
    fields: [
      { name: 'resourceName', type: 'string', required: true, description: 'The Azure resource name.' },
      { name: 'deploymentId', type: 'string', required: true, description: 'The deployment ID.' },
      { name: 'baseURL', type: 'string', description: 'The base URL for Azure OpenAI.' },
      { name: 'vectorizeClassName', type: 'boolean', description: 'Whether to vectorize the class name.' }
    ]
  },
  'text2vec-cohere': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'truncate', type: 'string', description: 'The truncation strategy (NONE, START, END).' },
      { name: 'baseURL', type: 'string', description: 'The base URL for Cohere API.' },
      { name: 'vectorizeClassName', type: 'boolean', description: 'Whether to vectorize the class name.' }
    ]
  },
  'text2vec-contextionary': {
    fields: [
      { name: 'vectorizeClassName', type: 'boolean', description: 'Whether to vectorize the class name.' }
    ]
  },
  'text2vec-databricks': {
    fields: [
      { name: 'endpoint', type: 'string', required: true, description: 'The Databricks endpoint URL.' },
      { name: 'vectorizeClassName', type: 'boolean', description: 'Whether to vectorize the class name.' }
    ]
  },
  'text2vec-gpt4all': {
    fields: [
      { name: 'vectorizeClassName', type: 'boolean', description: 'Whether to vectorize the class name.' }
    ]
  },
  'text2vec-huggingface': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'passageModel', type: 'string', description: 'The passage model to use.' },
      { name: 'queryModel', type: 'string', description: 'The query model to use.' },
      { name: 'endpointURL', type: 'string', description: 'The endpoint URL for the model.' },
      { name: 'waitForModel', type: 'boolean', description: 'Whether to wait for the model to be ready.' },
      { name: 'useGPU', type: 'boolean', description: 'Whether to use GPU.' },
      { name: 'useCache', type: 'boolean', description: 'Whether to use cache.' },
      { name: 'vectorizeClassName', type: 'boolean', description: 'Whether to vectorize the class name.' }
    ]
  },
  'text2vec-jinaai': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'baseURL', type: 'string', description: 'The base URL for Jina AI API.' },
      { name: 'vectorizeClassName', type: 'boolean', description: 'Whether to vectorize the class name.' }
    ]
  },
  'text2vec-nvidia': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'baseURL', type: 'string', description: 'The base URL for NVIDIA API.' },
      { name: 'truncation', type: 'boolean', description: 'Whether to apply truncation.' },
      { name: 'vectorizeClassName', type: 'boolean', description: 'Whether to vectorize the class name.' }
    ]
  },
  'text2vec-mistral': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'baseURL', type: 'string', description: 'The base URL for Mistral API.' },
      { name: 'vectorizeClassName', type: 'boolean', description: 'Whether to vectorize the class name.' }
    ]
  },
  'text2vec-model2vec': {
    fields: [
      { name: 'inferenceUrl', type: 'string', description: 'The URL where inference requests are sent.' },
      { name: 'vectorizeClassName', type: 'boolean', description: 'Whether to vectorize the class name.' }
    ]
  },
  'text2vec-ollama': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'apiEndpoint', type: 'string', description: 'The Ollama API endpoint.' },
      { name: 'vectorizeClassName', type: 'boolean', description: 'Whether to vectorize the class name.' }
    ]
  },
  'text2vec-openai': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use (e.g., text-embedding-ada-002).' },
      { name: 'modelVersion', type: 'string', description: 'The model version.' },
      { name: 'type', type: 'string', description: 'The type of embeddings (text, code).' },
      { name: 'baseURL', type: 'string', description: 'The base URL for OpenAI API.' },
      { name: 'dimensions', type: 'number', description: 'The dimensionality of the vector.' },
      { name: 'vectorizeClassName', type: 'boolean', description: 'Whether to vectorize the class name.' }
    ]
  },
  'text2vec-google': {
    fields: [
      { name: 'projectId', type: 'string', required: true, description: 'The project ID of the model in GCP.' },
      { name: 'location', type: 'string', description: 'The location where the model runs.' },
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'dimensions', type: 'number', description: 'The dimensionality of the vector.' },
      { name: 'vectorizeClassName', type: 'boolean', description: 'Whether to vectorize the class name.' }
    ]
  },
  'text2vec-google-ai-studio': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'vectorizeClassName', type: 'boolean', description: 'Whether to vectorize the class name.' }
    ]
  },
  'text2vec-transformers': {
    fields: [
      { name: 'poolingStrategy', type: 'string', description: 'The pooling strategy (masked_mean, cls).' },
      { name: 'inferenceUrl', type: 'string', description: 'The URL where inference requests are sent.' },
      { name: 'vectorizeClassName', type: 'boolean', description: 'Whether to vectorize the class name.' }
    ]
  },
  'text2vec-voyageai': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'baseURL', type: 'string', description: 'The base URL for Voyage AI API.' },
      { name: 'truncate', type: 'boolean', description: 'Whether to truncate input.' },
      { name: 'vectorizeClassName', type: 'boolean', description: 'Whether to vectorize the class name.' }
    ]
  },
  'text2vec-weaviate': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'vectorizeClassName', type: 'boolean', description: 'Whether to vectorize the class name.' }
    ]
  },
  'text2multivec-jinaai': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'baseURL', type: 'string', description: 'The base URL for Jina AI API.' },
      { name: 'dimensions', type: 'number', description: 'The dimensionality of the vector.' }
    ]
  }
}

/**
 * Get configuration fields for a specific vectorizer module
 * @param {string} moduleName - The name of the vectorizer module
 * @returns {Array} Array of field definitions
 */
export function getModuleConfigFields(moduleName) {
  return VECTORIZER_CONFIG_FIELDS[moduleName]?.fields || []
}

/**
 * Get all available vectorizer modules with their config fields
 * @returns {Object} Object mapping module names to their config fields
 */
export function getAllModuleConfigs() {
  return VECTORIZER_CONFIG_FIELDS
}

/**
 * Check if a module has configuration options
 * @param {string} moduleName - The name of the vectorizer module
 * @returns {boolean} True if the module has config options
 */
export function hasConfigOptions(moduleName) {
  const fields = getModuleConfigFields(moduleName)
  return fields && fields.length > 0
}

/**
 * Get required fields for a module
 * @param {string} moduleName - The name of the vectorizer module
 * @returns {Array} Array of required field names
 */
export function getRequiredFields(moduleName) {
  const fields = getModuleConfigFields(moduleName)
  return fields.filter(f => f.required).map(f => f.name)
}

/**
 * Validate module configuration
 * @param {string} moduleName - The name of the vectorizer module
 * @param {Object} config - The configuration object to validate
 * @returns {Object} Validation result with {valid: boolean, errors: string[]}
 */
export function validateModuleConfig(moduleName, config) {
  const fields = getModuleConfigFields(moduleName)
  const requiredFields = getRequiredFields(moduleName)
  const errors = []

  // Check for missing required fields
  requiredFields.forEach(fieldName => {
    if (!config || config[fieldName] === undefined || config[fieldName] === '') {
      errors.push(`Missing required field: ${fieldName}`)
    }
  })

  return {
    valid: errors.length === 0,
    errors
  }
}
