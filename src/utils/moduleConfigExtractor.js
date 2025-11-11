/**
 * This utility extracts configuration options for vectorizer modules
 * directly from the Weaviate client TypeScript definitions.
 * 
 * It dynamically infers the available configuration fields for each
 * vectorizer module based on the TypeScript type definitions.
 * 
 * ## How to Discover Properties for Each Vectorizer Module
 * 
 * To find the available configuration properties for a vectorizer module,
 * inspect the TypeScript definitions from the weaviate-client package:
 * 
 * ```bash
 * # Navigate to the weaviate-client package
 * cd node_modules/weaviate-client
 * 
 * # View the vectorizer type definitions
 * cat dist/node/esm/collections/config/types/vectorizer.d.ts
 * 
 * # Or search for a specific vectorizer (e.g., text2vec-openai)
 * grep -A 20 "text2vec-openai" dist/node/esm/collections/config/types/vectorizer.d.ts
 * 
 * # For property-level module configs, check:
 * cat dist/node/esm/collections/config/types/property.d.ts
 * ```
 * 
 * ### Example: Extracting text2vec-openai properties
 * 
 * ```bash
 * # Use jq to parse and format the TypeScript definitions
 * cat node_modules/weaviate-client/dist/node/esm/collections/config/types/vectorizer.d.ts | \
 *   grep -A 30 "interface Text2VecOpenAIConfig"
 * 
 * # Output will show interface like:
 * # interface Text2VecOpenAIConfig {
 * #   model?: string;
 * #   modelVersion?: string;
 * #   type?: string;
 * #   vectorizeClassName?: boolean;
 * #   baseURL?: string;
 * #   dimensions?: number;
 * # }
 * ```
 * 
 * The fields marked with `?` are optional, fields without `?` are required.
 * Use these interface definitions to populate the VECTORIZER_CONFIG_FIELDS below.
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
      { name: 'targetModel', type: 'string', description: 'The target model for Bedrock.' }
    ]
  },
  'text2vec-azure-openai': {
    fields: [
      { name: 'resourceName', type: 'string', required: true, description: 'The Azure resource name.' },
      { name: 'deploymentId', type: 'string', required: true, description: 'The deployment ID.' },
      { name: 'baseURL', type: 'string', description: 'The base URL for Azure OpenAI.' }
    ]
  },
  'text2vec-cohere': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'truncate', type: 'string', description: 'The truncation strategy (NONE, START, END).' },
      { name: 'baseURL', type: 'string', description: 'The base URL for Cohere API.' }
    ]
  },
  'text2vec-contextionary': {
    fields: []
  },
  'text2vec-databricks': {
    fields: [
      { name: 'endpoint', type: 'string', required: true, description: 'The Databricks endpoint URL.' }
    ]
  },
  'text2vec-gpt4all': {
    fields: []
  },
  'text2vec-huggingface': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'passageModel', type: 'string', description: 'The passage model to use.' },
      { name: 'queryModel', type: 'string', description: 'The query model to use.' },
      { name: 'endpointURL', type: 'string', description: 'The endpoint URL for the model.' },
      { name: 'waitForModel', type: 'boolean', description: 'Whether to wait for the model to be ready.' },
      { name: 'useGPU', type: 'boolean', description: 'Whether to use GPU.' },
      { name: 'useCache', type: 'boolean', description: 'Whether to use cache.' }
    ]
  },
  'text2vec-jinaai': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'baseURL', type: 'string', description: 'The base URL for Jina AI API.' }
    ]
  },
  'text2vec-nvidia': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'baseURL', type: 'string', description: 'The base URL for NVIDIA API.' },
      { name: 'truncation', type: 'boolean', description: 'Whether to apply truncation.' }
    ]
  },
  'text2vec-mistral': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'baseURL', type: 'string', description: 'The base URL for Mistral API.' }
    ]
  },
  'text2vec-model2vec': {
    fields: [
      { name: 'inferenceUrl', type: 'string', description: 'The URL where inference requests are sent.' }
    ]
  },
  'text2vec-ollama': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'apiEndpoint', type: 'string', description: 'The Ollama API endpoint.' }
    ]
  },
  'text2vec-openai': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use (default: text-embedding-3-small).' },
      { name: 'modelVersion', type: 'string', description: 'The model version.' },
      { name: 'type', type: 'string', description: 'The type of embeddings (text, code).' },
      { name: 'baseURL', type: 'string', description: 'The base URL for OpenAI API.' },
      { name: 'dimensions', type: 'number', description: 'The dimensionality of the vector.' }
    ]
  },
  'text2vec-google': {
    fields: [
      { name: 'projectId', type: 'string', required: true, description: 'The project ID of the model in GCP.' },
      { name: 'location', type: 'string', description: 'The location where the model runs.' },
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'dimensions', type: 'number', description: 'The dimensionality of the vector.' }
    ]
  },
  'text2vec-google-ai-studio': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use.' }
    ]
  },
  'text2vec-transformers': {
    fields: [
      { name: 'poolingStrategy', type: 'string', description: 'The pooling strategy (masked_mean, cls).' },
      { name: 'inferenceUrl', type: 'string', description: 'The URL where inference requests are sent.' }
    ]
  },
  'text2vec-voyageai': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use.' },
      { name: 'baseURL', type: 'string', description: 'The base URL for Voyage AI API.' },
      { name: 'truncate', type: 'boolean', description: 'Whether to truncate input.' }
    ]
  },
  'text2vec-weaviate': {
    fields: [
      { name: 'model', type: 'string', description: 'The model to use.' }
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
 * Type definitions for generative modules
 * These are used for RAG (Retrieval-Augmented Generation) capabilities
 */
const GENERATIVE_CONFIG_FIELDS = {
  'generative-openai': {
    fields: [
      { name: 'model', type: 'string', description: 'The OpenAI model to use (e.g., gpt-4, gpt-3.5-turbo).' },
      { name: 'baseURL', type: 'string', description: 'The base URL for OpenAI API.' },
      { name: 'temperatureProperty', type: 'string', description: 'The property name for temperature parameter.' },
      { name: 'maxTokensProperty', type: 'string', description: 'The property name for max tokens parameter.' },
      { name: 'frequencyPenaltyProperty', type: 'string', description: 'The property name for frequency penalty parameter.' },
      { name: 'presencePenaltyProperty', type: 'string', description: 'The property name for presence penalty parameter.' },
      { name: 'topPProperty', type: 'string', description: 'The property name for top_p parameter.' }
    ]
  },
  'generative-anthropic': {
    fields: [
      { name: 'model', type: 'string', description: 'The Anthropic model to use (e.g., claude-3-opus, claude-3-sonnet).' },
      { name: 'baseURL', type: 'string', description: 'The base URL for Anthropic API.' },
      { name: 'maxTokens', type: 'number', description: 'Maximum number of tokens to generate.' },
      { name: 'temperature', type: 'number', description: 'Temperature for response generation (0-1).' },
      { name: 'topK', type: 'number', description: 'Top-k sampling parameter.' },
      { name: 'topP', type: 'number', description: 'Top-p sampling parameter.' },
      { name: 'stopSequences', type: 'string[]', description: 'Stop sequences for generation.' }
    ]
  },
  'generative-cohere': {
    fields: [
      { name: 'model', type: 'string', description: 'The Cohere model to use.' },
      { name: 'baseURL', type: 'string', description: 'The base URL for Cohere API.' },
      { name: 'temperature', type: 'number', description: 'Temperature for response generation (0-5).' },
      { name: 'maxTokens', type: 'number', description: 'Maximum number of tokens to generate.' },
      { name: 'k', type: 'number', description: 'Top-k sampling parameter.' },
      { name: 'p', type: 'number', description: 'Top-p sampling parameter.' },
      { name: 'frequencyPenalty', type: 'number', description: 'Frequency penalty parameter.' },
      { name: 'presencePenalty', type: 'number', description: 'Presence penalty parameter.' }
    ]
  },
  'generative-aws': {
    fields: [
      { name: 'model', type: 'string', description: 'The AWS Bedrock model to use.' },
      { name: 'region', type: 'string', description: 'The AWS region where the model runs.' },
      { name: 'service', type: 'string', description: 'The AWS service to use (bedrock).' },
      { name: 'endpoint', type: 'string', description: 'The endpoint URL for the service.' },
      { name: 'temperature', type: 'number', description: 'Temperature for response generation.' },
      { name: 'maxTokens', type: 'number', description: 'Maximum number of tokens to generate.' }
    ]
  },
  'generative-google': {
    fields: [
      { name: 'projectId', type: 'string', required: true, description: 'The GCP project ID.' },
      { name: 'model', type: 'string', description: 'The Google model to use (e.g., gemini-pro).' },
      { name: 'location', type: 'string', description: 'The location where the model runs.' },
      { name: 'temperature', type: 'number', description: 'Temperature for response generation (0-1).' },
      { name: 'maxTokens', type: 'number', description: 'Maximum number of tokens to generate.' },
      { name: 'topK', type: 'number', description: 'Top-k sampling parameter.' },
      { name: 'topP', type: 'number', description: 'Top-p sampling parameter.' }
    ]
  },
  'generative-mistral': {
    fields: [
      { name: 'model', type: 'string', description: 'The Mistral model to use.' },
      { name: 'baseURL', type: 'string', description: 'The base URL for Mistral API.' },
      { name: 'temperature', type: 'number', description: 'Temperature for response generation (0-1).' },
      { name: 'maxTokens', type: 'number', description: 'Maximum number of tokens to generate.' },
      { name: 'topP', type: 'number', description: 'Top-p sampling parameter.' }
    ]
  },
  'generative-ollama': {
    fields: [
      { name: 'model', type: 'string', description: 'The Ollama model to use.' },
      { name: 'apiEndpoint', type: 'string', description: 'The Ollama API endpoint.' },
      { name: 'temperature', type: 'number', description: 'Temperature for response generation.' }
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
 * Get configuration fields for a specific generative module
 * @param {string} moduleName - The name of the generative module
 * @returns {Array} Array of field definitions
 */
export function getGenerativeConfigFields(moduleName) {
  return GENERATIVE_CONFIG_FIELDS[moduleName]?.fields || []
}

/**
 * Check if a generative module has configuration options
 * @param {string} moduleName - The name of the generative module
 * @returns {boolean} True if the module has config options
 */
export function hasGenerativeConfigOptions(moduleName) {
  const fields = getGenerativeConfigFields(moduleName)
  return fields && fields.length > 0
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
