export const tokenizationOptions = [
  { value: 'word', label: 'Word', description: 'Tokenize by word' },
  { value: 'field', label: 'Field', description: 'Tokenize by field' },
  { value: 'whitespace', label: 'Whitespace', description: 'Tokenize by whitespace' },
  { value: 'lowercase', label: 'Lowercase', description: 'Tokenize by lowercase' },
  { value: 'gse', label: 'GSE', description: 'Tokenize using GSE (Chinese/Japanese) - requires server support' },
  { value: 'trigram', label: 'Trigram', description: 'Tokenize into trigrams - requires server support' },
  { value: 'kagome_ja', label: 'Kagome JA', description: 'Tokenize using Kagome (Japanese) - requires server support' },
  { value: 'kagome_kr', label: 'Kagome KR', description: 'Tokenize using Kagome (Korean) - requires server support' }
]

export const dataTypeOptions = [
  { value: 'text', label: 'text' },
  { value: 'int', label: 'int' },
  { value: 'number', label: 'number' },
  { value: 'boolean', label: 'boolean' },
  { value: 'date', label: 'date' },
  { value: 'geoCoordinates', label: 'geoCoordinates' },
  { value: 'phoneNumber', label: 'phoneNumber' },
  { value: 'uuid', label: 'uuid' },
  { value: 'blob', label: 'blob' }
]

export const indexTypeOptions = [
  { value: 'hnsw', label: 'HNSW (Recommended)', description: 'Hierarchical Navigable Small World graph' },
  { value: 'flat', label: 'Flat', description: 'Flat index for brute-force search' },
  { value: 'dynamic', label: 'Dynamic', description: 'Dynamically switches between HNSW and Flat' }
]

// All available modules from Weaviate
export const allAvailableModules = {
  'generative-anthropic': {
    documentationHref: 'https://docs.anthropic.com/en/api/getting-started',
    name: 'Generative Search - Anthropic'
  },
  'generative-anyscale': {
    documentationHref: 'https://docs.anyscale.com/endpoints/text-generation/',
    name: 'Generative Search - Anyscale'
  },
  'generative-aws': {
    documentationHref: 'https://docs.aws.amazon.com/bedrock/latest/APIReference/welcome.html',
    name: 'Generative Search - AWS'
  },
  'generative-azure-openai': {
    documentationHref: 'https://learn.microsoft.com/en-us/azure/ai-services/openai/',
    name: 'Generative Search - Azure OpenAI'
  },
  'generative-cohere': {
    documentationHref: 'https://docs.cohere.com/reference/chat',
    name: 'Generative Search - Cohere'
  },
  'generative-databricks': {
    documentationHref: 'https://docs.databricks.com/en/generative-ai/generative-ai.html',
    name: 'Generative Search - Databricks'
  },
  'generative-friendliai': {
    documentationHref: 'https://docs.friendli.ai/',
    name: 'Generative Search - FriendliAI'
  },
  'generative-google': {
    documentationHref: 'https://cloud.google.com/vertex-ai/docs/generative-ai/chat/test-chat-prompts',
    name: 'Generative Search - Google'
  },
  'generative-mistral': {
    documentationHref: 'https://docs.mistral.ai/api/',
    name: 'Generative Search - Mistral'
  },
  'generative-nvidia': {
    documentationHref: 'https://docs.nvidia.com/nim/',
    name: 'Generative Search - NVIDIA'
  },
  'generative-ollama': {
    documentationHref: 'https://github.com/ollama/ollama/blob/main/docs/api.md#generate-a-completion',
    name: 'Generative Search - Ollama'
  },
  'generative-openai': {
    documentationHref: 'https://platform.openai.com/docs/api-reference/completions',
    name: 'Generative Search - OpenAI'
  },
  'generative-xai': {
    documentationHref: 'https://docs.x.ai/api',
    name: 'Generative Search - xAI'
  },
  'multi2vec-google': {
    documentationHref: 'https://cloud.google.com/vertex-ai/generative-ai/docs/embeddings/get-multimodal-embeddings',
    name: 'Google Multimodal Module'
  },
  'qna-openai': {
    documentationHref: 'https://platform.openai.com/docs/api-reference/completions',
    name: 'OpenAI Question & Answering Module'
  },
  'ref2vec-centroid': {
    name: 'Ref2Vec Centroid'
  },
  'reranker-cohere': {
    documentationHref: 'https://txt.cohere.com/rerank/',
    name: 'Reranker - Cohere'
  },
  'reranker-jinaai': {
    documentationHref: 'https://jina.ai/reranker',
    name: 'Reranker - Jinaai'
  },
  'reranker-nvidia': {
    documentationHref: 'https://docs.nvidia.com/nim/nemo-retriever/reranking/latest/index.html',
    name: 'Reranker - NVIDIA'
  },
  'reranker-transformers': {
    documentationHref: 'https://weaviate.io/developers/weaviate/model-providers/transformers/reranker',
    name: 'Reranker - Transformers'
  },
  'reranker-voyageai': {
    documentationHref: 'https://docs.voyageai.com/reference/reranker-api',
    name: 'Reranker - VoyageAI'
  },
  'text2vec-aws': {
    documentationHref: 'https://docs.aws.amazon.com/bedrock/latest/userguide/titan-embedding-models.html',
    name: 'AWS Module'
  },
  'text2vec-cohere': {
    documentationHref: 'https://docs.cohere.ai/embedding-wiki/',
    name: 'Cohere Module'
  },
  'text2vec-google': {
    documentationHref: 'https://cloud.google.com/vertex-ai/docs/generative-ai/embeddings/get-text-embeddings',
    name: 'Google Module'
  },
  'text2vec-huggingface': {
    documentationHref: 'https://huggingface.co/docs/api-inference/detailed_parameters#feature-extraction-task',
    name: 'Hugging Face Module'
  },
  'text2vec-jinaai': {
    documentationHref: 'https://jina.ai/embeddings/',
    name: 'JinaAI Module'
  },
  'text2vec-mistral': {
    documentationHref: 'https://docs.mistral.ai/api/#operation/createEmbedding',
    name: 'Mistral Module'
  },
  'text2vec-ollama': {
    documentationHref: 'https://github.com/ollama/ollama/blob/main/docs/api.md#generate-embeddings',
    name: 'Ollama Module'
  },
  'text2vec-openai': {
    documentationHref: 'https://platform.openai.com/docs/guides/embeddings/what-are-embeddings',
    name: 'OpenAI Module'
  },
  'text2vec-voyageai': {
    documentationHref: 'https://docs.voyageai.com/docs/embeddings',
    name: 'VoyageAI Module'
  },
  'text2vec-weaviate': {
    documentationHref: 'https://api.embedding.weaviate.io',
    name: 'Weaviate Embedding Module'
  }
}

// Filter out backup modules and return vectorizer modules for select options
export function getVectorizerModuleOptions(availableModules = null) {
  const modules = availableModules || allAvailableModules
  
  return Object.entries(modules)
    .filter(([key]) => {
      // Remove backup, generative, and reranker modules
      return !key.startsWith('backup-') && 
             !key.startsWith('generative-') && 
             !key.startsWith('reranker-')
    })
    .map(([key, value]) => ({
      value: key,
      label: value.name || key,
      documentationHref: value.documentationHref
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}
