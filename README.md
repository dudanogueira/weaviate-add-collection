# Weaviate Add Collection (minimal)

A minimal React app (Vite) with a Collection component to compose a Weaviate collection JSON.

## Quick Start (macOS, zsh)

```bash
# install deps
npm install

# start dev server
npm run dev
```

## Testing

This project includes integration tests that work with a local Weaviate instance.

```bash
# Run tests (requires Weaviate running on localhost:8080)
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui
```

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## How it Works
- Open the app at http://localhost:5173 (default Vite port).
- Fill the name and description fields. The generated JSON will update live below the form.
- You can also import a JSON file with `name` and `description` keys to prepopulate the form.
 - Use the "Copy" button to copy the generated JSON, or "Download" to save it as `{CollectionName}_weaviate_schema.json`.

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

#### **Vectorize Class Name**
- **Type:** Checkbox
- **Default:** false
- **Purpose:** Whether to include the collection/class name in vectorization
- **Note:** Common to all vectorizer modules

### Tabbed Interface

The vector configuration is organized into **three tabs** for better organization:

#### Tab 1: Vectorizer Module
Configure which embedding model to use and its specific settings.

- **Vectorizer Module** (Dropdown)
  - Select from 40+ available modules
  - Categories: text2vec-*, multi2vec-*, ref2vec-*, etc.
  
- **Module Configuration** (Dynamic)
  - Automatically shows relevant fields based on selected module
  - Examples: model, dimensions, projectId, baseURL, etc.
  - Required fields marked with *

**Note:** Backup, generative, and reranker modules are filtered out.

#### Tab 2: Index Configuration
Configure the vector index type and optimization parameters.

- **Index Types:**
  - **HNSW** - Fast approximate search (recommended)
  - **Flat** - Exact search for small datasets
  - **Dynamic** - Auto-switches based on collection size

- **HNSW Parameters:**
  - Distance Metric (cosine, dot, l2-squared, manhattan, hamming)
  - ef Construction (build quality)
  - ef (search quality)
  - Max Connections (graph density)

- **Flat Parameters:**
  - Distance Metric only

- **Dynamic Parameters:**
  - Distance Metric
  - Threshold (when to switch from flat to HNSW)

#### Tab 3: Compression/Quantization
Reduce memory usage by compressing vectors.

- **Quantization Types:**
  - **None** - Full precision (default)
  - **PQ** - Product Quantization (8x-32x compression)
  - **BQ** - Binary Quantization (32x compression)
  - **SQ** - Scalar Quantization (4x compression)

- **PQ Parameters:**
  - Segments, Centroids, Training Limit, Distribution

- **BQ/SQ Parameters:**
  - Rescore Limit, Training Limit

See [TABS_DOCUMENTATION.md](TABS_DOCUMENTATION.md) for detailed information about each tab.

### Dynamic Module Configuration

When you select a vectorizer module, the application automatically infers the available configuration options for that module directly from the Weaviate client library. This ensures that the configuration form always matches the actual API requirements.

#### How It Works

1. **Type Definition Extraction:** The application reads the TypeScript type definitions from `weaviate-client` to understand what configuration fields are available for each module.

2. **Dynamic Form Generation:** Based on the selected module, a configuration form is automatically generated with the appropriate fields.

3. **Field Types:** The form intelligently renders different input types:
   - **String fields:** Text inputs
   - **Number fields:** Numeric inputs
   - **Boolean fields:** Checkboxes
   - **Array fields:** Comma-separated text inputs
   - **Object fields:** JSON textarea editors

4. **Required Fields:** Fields marked as required in the type definitions are indicated with a red asterisk (*).

#### Example Module Configurations

**text2vec-openai:**
- `model` (string) - The model to use (e.g., text-embedding-ada-002)
- `modelVersion` (string) - The model version
- `type` (string) - The type of embeddings (text, code)
- `baseURL` (string) - The base URL for OpenAI API
- `dimensions` (number) - The dimensionality of the vector
- `vectorizeClassName` (boolean) - Whether to vectorize the class name

**text2vec-google:**
- `projectId` (string) * - The project ID of the model in GCP
- `location` (string) - The location where the model runs
- `model` (string) - The model to use
- `dimensions` (number) - The dimensionality of the vector
- `vectorizeClassName` (boolean) - Whether to vectorize the class name

**multi2vec-clip:**
- `imageFields` (string[]) - The image fields used when vectorizing
- `inferenceUrl` (string) - The URL where inference requests are sent
- `textFields` (string[]) - The text fields used when vectorizing
- `vectorizeCollectionName` (boolean) - Whether the collection name is vectorized
- `weights` (object) - The weights of the fields used for vectorization

### Usage

1. Click "Add Vector Config" to create a new configuration
2. Enter a unique name for the configuration
3. Select a vectorizer module from the dropdown
4. **Configure module settings:** Once a module is selected, a dynamic configuration form will appear with module-specific options
5. Fill in the module configuration fields as needed (required fields are marked with *)
6. Choose an index type (default is HNSW)
7. Click the documentation link (if available) to learn more about the selected module
8. Repeat to add multiple vector configurations

### Generated JSON Structure

The vector configurations are output in the `vectorConfig` object with module-specific settings:

```json
{
  "class": "MyCollection",
  "description": "A Brand new collection",
  "vectorConfig": {
    "default": {
      "vectorizer": {
        "text2vec-openai": {
          "model": "text-embedding-ada-002",
          "vectorizeClassName": false,
          "dimensions": 1536
        }
      },
      "vectorIndexType": "hnsw"
    },
    "semantic": {
      "vectorizer": {
        "text2vec-google": {
          "projectId": "my-gcp-project",
          "location": "us-central1",
          "model": "textembedding-gecko@001",
          "vectorizeClassName": true
        }
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

## Architecture

### Module Configuration System

The module configuration system is designed to automatically extract and utilize the type definitions from the `weaviate-client` library, ensuring that the UI always stays in sync with the API.

#### Components

1. **moduleConfigExtractor.js** (`src/utils/`)
   - Extracts configuration field definitions for each vectorizer module
   - Based on TypeScript type definitions from `weaviate-client`
   - Provides validation and helper functions
   - Contains metadata about each field (name, type, description, required)

2. **ModuleConfigForm.jsx** (`src/components/`)
   - Dynamically renders configuration forms based on module selection
   - Handles different field types (string, number, boolean, array, object)
   - Provides appropriate input controls for each type
   - Displays field descriptions and marks required fields

3. **VectorConfigItem.jsx** (`src/components/`)
   - Manages individual vector configuration items
   - Integrates the ModuleConfigForm component
   - Handles state updates for module configuration

4. **Collection.jsx** (`src/components/`)
   - Orchestrates the entire collection configuration
   - Merges module configurations into the final JSON output
   - Maintains state for all vector configurations

#### Data Flow

```
User selects module
    ↓
VectorConfigItem detects change
    ↓
ModuleConfigForm queries moduleConfigExtractor
    ↓
Form fields are rendered based on module type
    ↓
User fills in configuration
    ↓
Config stored in vectorConfig state
    ↓
Collection.jsx merges into final JSON
```

#### Type Mapping

The system maps TypeScript types to form inputs:

| TypeScript Type | Form Input | Example |
|----------------|------------|---------|
| `string` | Text input | `model: "text-embedding-ada-002"` |
| `number` | Number input | `dimensions: 1536` |
| `boolean` | Checkbox | `vectorizeClassName: false` |
| `string[]` | Comma-separated text | `imageFields: ["image1", "image2"]` |
| `object` | JSON textarea | `weights: {"imageFields": [0.7]}` |

#### Benefits

1. **Type Safety:** Configurations match the actual API requirements
2. **Automatic Updates:** When new modules are added to weaviate-client, they automatically become available
3. **Self-Documenting:** Field descriptions are embedded in the UI
4. **Validation:** Required fields are enforced
5. **Maintainability:** Single source of truth (weaviate-client types)

### Examples

See `examples/moduleConfigExamples.js` for complete working examples of different vectorizer configurations.


