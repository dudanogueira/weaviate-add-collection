# Testing Guide

This project includes integration tests for the Weaviate collection creator component.

## Prerequisites

Before running the tests, you need to have:

1. **Weaviate running locally** - The tests connect to a local Weaviate instance at `http://localhost:8080`
   
   To start Weaviate locally using Docker:
   ```bash
   docker run -d \
     -p 8080:8080 \
     -p 50051:50051 \
     --name weaviate \
     -e AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED=true \
     -e PERSISTENCE_DATA_PATH=/var/lib/weaviate \
     semitechnologies/weaviate:latest
   ```

## Running Tests

### Run all tests in watch mode (interactive)
```bash
npm test
```

### Run all tests once
```bash
npm run test:run
```

### Run tests with UI
```bash
npm run test:ui
```

This will open a browser with a visual interface to run and debug tests.

## Test Files

### `Collection.create.test.jsx`
Tests the creation of a collection from form input:
1. Fills in collection name and description
2. Adds a property
3. Verifies the generated JSON
4. Creates the collection in Weaviate using the generated JSON
5. Verifies the collection was created correctly

### `Collection.exportImport.test.jsx`
Tests the export/import round-trip functionality:
1. Creates a collection with specific configuration in Weaviate
2. Exports the collection schema
3. Imports the schema into the React component
4. Verifies the generated JSON matches the original
5. Tests with both simple collections and collections with vectorizer configuration

### `Collection.arrayImport.test.jsx`
Tests array type handling during import:
1. Imports collections with array properties (e.g., `text[]`, `number[]`)
2. Verifies the array checkbox is automatically checked
3. Tests various array notation formats (array vs string dataType)
4. Ensures non-array types remain unchanged

## Test Utilities

The `src/test/weaviateHelper.js` file provides helper functions for:
- Connecting to Weaviate (`getWeaviateClient`)
- Creating collections (`createCollection`)
- Deleting collections (`deleteCollection`)
- Exporting collection schemas (`exportCollectionSchema`)
- Getting collections (`getCollection`)

## Troubleshooting

### Connection errors
If you see connection errors, make sure:
- Weaviate is running on `http://localhost:8080`
- You can access it at: http://localhost:8080/v1/.well-known/ready

### Test collection cleanup
Tests automatically clean up after themselves by deleting test collections. If a test fails, you may need to manually delete test collections:
- `TestCollection`
- `ExportImportTestCollection`
- `VectorTestCollection`

You can delete collections using the Weaviate console or API.
