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

