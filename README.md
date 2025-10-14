# Weaviate Add Collection (minimal)

A minimal React app (Vite) with a Collection component to compose a Weaviate collection JSON.

Quick start (macOS, zsh):

```bash
# install deps
npm install

# start dev server
npm run dev
```

How it works:
- Open the app at http://localhost:5173 (default Vite port).
- Fill the name and description fields. The generated JSON will update live below the form.
- You can also import a JSON file with `name` and `description` keys to prepopulate the form.

# UI Rules

## Property

### Conditional Field Display

The following fields are shown conditionally based on the selected data type:

#### **Tokenization**
- **Visible only for:** `text` data type
- **Options:** word, whitespace, lowercase, field, gse, trigram, kagome_ja, kagome_kr
- **Default:** word
- **Purpose:** Defines how text is tokenized for search indexing

#### **indexSearchable**
- **Visible only for:** `text` data type
- **Type:** Checkbox
- **Default:** true
- **Purpose:** Enables inverted index for text search capabilities

#### **indexRangeFilters**
- **Visible only for:** `int`, `number`, `date` data types
- **Type:** Checkbox
- **Default:** false
- **Purpose:** Enables range filtering for numeric and date values

#### **indexFilterable**
- **Visible for:** All data types
- **Type:** Checkbox
- **Default:** true
- **Purpose:** Enables general filtering on this property

### Data Types

Available data types:
- `text` - Text strings (shows tokenization and indexSearchable options)
- `int` - Integer numbers (shows indexRangeFilters option)
- `number` - Floating-point numbers (shows indexRangeFilters option)
- `date` - Date values (shows indexRangeFilters option)
- `boolean` - True/false values
- `geoCoordinates` - Geographic coordinates
- `phoneNumber` - Phone number values
- `uuid` - UUID values
- `blob` - Binary data

### Array Support

Any data type can be configured as an array by checking the "array" checkbox. This appends `[]` to the data type in the generated JSON (e.g., `text[]`, `int[]`).

### JSON Field Mapping

The following UI fields are mapped differently in the generated JSON:

- Collection UI field `name` → JSON field `class`
- Property UI field `name` → JSON field `name` (unchanged)

## Vectorizer Configuration

### Overview

The Vectorizer Configuration section allows you to add multiple vector configurations to your collection. Each configuration generates a `vectorConfig` entry in the JSON output.

### Vector Config Fields

Each vector configuration has the following fields:

#### **Name**
- **Type:** Text input
- **Required:** Yes (auto-generated if empty)
- **Default:** `vector_config_1`, `vector_config_2`, etc.
- **Purpose:** Unique identifier for this vector configuration
- **Examples:** `default`, `semantic`, `contextual`

#### **Vectorizer Module**
- **Type:** Dropdown select
- **Required:** Yes
- **Purpose:** Selects which vectorizer module to use for this configuration
- **Available modules:** Can be passed as a prop (`availableModules`), otherwise uses all default modules
- **Module categories:**
  - **Text2Vec modules:** text2vec-openai, text2vec-cohere, text2vec-huggingface, etc.
  - **Multi2Vec modules:** multi2vec-google
  - **Generative modules:** generative-openai, generative-anthropic, generative-cohere, etc.
  - **Reranker modules:** reranker-cohere, reranker-jinaai, reranker-voyageai
  - **Other modules:** qna-openai, ref2vec-centroid

**Note:** Backup modules (e.g., `backup-filesystem`) are automatically filtered out from the selection.

#### **Index Type**
- **Type:** Dropdown select
- **Options:**
  - **HNSW (Recommended)** - Hierarchical Navigable Small World graph
  - **Flat** - Flat index for brute-force search
  - **Dynamic** - Dynamically switches between HNSW and Flat
- **Default:** HNSW
- **Purpose:** Determines the vector index algorithm used

### Usage

1. Click "Add Vector Config" to create a new configuration
2. Enter a unique name for the configuration
3. Select a vectorizer module from the dropdown
4. Choose an index type (default is HNSW)
5. Click the documentation link (if available) to learn more about the selected module
6. Repeat to add multiple vector configurations

### Generated JSON Structure

The vector configurations are output in the `vectorConfig` object:

```json
{
  "class": "MyCollection",
  "description": "A Brand new collection",
  "vectorConfig": {
    "default": {
      "vectorizer": {
        "text2vec-openai": {}
      },
      "vectorIndexType": "hnsw"
    },
    "semantic": {
      "vectorizer": {
        "text2vec-cohere": {}
      },
      "vectorIndexType": "flat"
    }
  }
}
```

### Props

The `Collection` component accepts the following props:

- `initialJson` (optional): JSON object to prepopulate the form
- `availableModules` (optional): Object containing available vectorizer modules from the server. If not provided, all default modules are available.

Example usage with custom available modules:

```jsx
<Collection availableModules={serverModules} />
```

