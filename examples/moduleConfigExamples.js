/**
 * Example: Using Dynamic Module Configuration
 * 
 * This example demonstrates how the module configuration is automatically
 * inferred from the Weaviate client library.
 */

// Example 1: text2vec-openai with full configuration
const example1 = {
  class: "Articles",
  description: "Collection of articles with OpenAI embeddings",
  vectorConfig: {
    default: {
      vectorizer: {
        "text2vec-openai": {
          model: "text-embedding-3-small",
          dimensions: 1536,
          vectorizeClassName: false,
          baseURL: "https://api.openai.com/v1"
        }
      },
      vectorIndexType: "hnsw"
    }
  },
  properties: [
    {
      name: "title",
      dataType: ["text"],
      description: "Article title",
      indexFilterable: true,
      indexSearchable: true,
      tokenization: "word"
    },
    {
      name: "content",
      dataType: ["text"],
      description: "Article content",
      indexFilterable: true,
      indexSearchable: true,
      tokenization: "word"
    }
  ]
}

// Example 2: text2vec-google with required fields
const example2 = {
  class: "Documents",
  description: "Collection with Google Vertex AI embeddings",
  vectorConfig: {
    semantic: {
      vectorizer: {
        "text2vec-google": {
          projectId: "my-gcp-project-123",
          location: "us-central1",
          model: "textembedding-gecko@003",
          dimensions: 768,
          vectorizeClassName: true
        }
      },
      vectorIndexType: "hnsw"
    }
  },
  properties: [
    {
      name: "content",
      dataType: ["text"],
      description: "Document content"
    }
  ]
}

// Example 3: Multi2vec with image and text fields
const example3 = {
  class: "Products",
  description: "Products with multimodal embeddings",
  vectorConfig: {
    multimodal: {
      vectorizer: {
        "multi2vec-clip": {
          imageFields: ["product_image", "thumbnail"],
          textFields: ["name", "description"],
          vectorizeCollectionName: false,
          weights: {
            imageFields: [0.7, 0.3],
            textFields: [0.8, 0.5]
          }
        }
      },
      vectorIndexType: "hnsw"
    }
  },
  properties: [
    {
      name: "name",
      dataType: ["text"],
      description: "Product name"
    },
    {
      name: "description",
      dataType: ["text"],
      description: "Product description"
    },
    {
      name: "product_image",
      dataType: ["blob"],
      description: "Main product image"
    },
    {
      name: "thumbnail",
      dataType: ["blob"],
      description: "Product thumbnail"
    }
  ]
}

// Example 4: Multiple vector configurations
const example4 = {
  class: "MultiVector",
  description: "Collection with multiple vector configurations",
  vectorConfig: {
    openai_semantic: {
      vectorizer: {
        "text2vec-openai": {
          model: "text-embedding-ada-002",
          vectorizeClassName: false
        }
      },
      vectorIndexType: "hnsw"
    },
    cohere_contextual: {
      vectorizer: {
        "text2vec-cohere": {
          model: "embed-multilingual-v3.0",
          truncate: "END",
          vectorizeClassName: true
        }
      },
      vectorIndexType: "flat"
    },
    huggingface_custom: {
      vectorizer: {
        "text2vec-huggingface": {
          model: "sentence-transformers/all-MiniLM-L6-v2",
          endpointURL: "https://my-hf-endpoint.com",
          waitForModel: true,
          useGPU: false,
          useCache: true,
          vectorizeClassName: false
        }
      },
      vectorIndexType: "dynamic"
    }
  },
  properties: [
    {
      name: "text",
      dataType: ["text"],
      description: "Text content"
    }
  ]
}

// Example 5: ref2vec-centroid (special case)
const example5 = {
  class: "Recommendations",
  description: "User recommendations based on references",
  vectorConfig: {
    default: {
      vectorizer: {
        "ref2vec-centroid": {
          referenceProperties: ["liked_products", "viewed_items"],
          method: "mean"
        }
      },
      vectorIndexType: "hnsw"
    }
  },
  properties: [
    {
      name: "user_id",
      dataType: ["text"],
      description: "User identifier"
    },
    {
      name: "liked_products",
      dataType: ["text[]"],
      description: "Array of product IDs the user liked"
    },
    {
      name: "viewed_items",
      dataType: ["text[]"],
      description: "Array of item IDs the user viewed"
    }
  ]
}

export {
  example1,
  example2,
  example3,
  example4,
  example5
}
