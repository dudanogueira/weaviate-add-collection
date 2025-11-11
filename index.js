// Public API exports for weaviate-add-collection
// 
// The Collection component accepts the following props:
// - initialJson: optional JSON object to prepopulate the form
// - availableModules: optional object with available vectorizer modules
// - nodesNumber: optional number for replication factor limit
// - onChange: optional callback (schema: object) => void called on every schema change
// - onSubmit: optional callback (schema: object) => void called when submit button is clicked
//
// Example usage with callbacks:
// import Collection from 'weaviate-add-collection';
// 
// function App() {
//   const handleChange = (schema) => console.log('Schema:', schema);
//   const handleSubmit = async (schema) => {
//     await fetch('http://localhost:8080/v1/schema', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(schema)
//     });
//   };
//   return <Collection onChange={handleChange} onSubmit={handleSubmit} />;
// }

export { default as Collection } from './src/components/Collection';
export { default } from './src/components/Collection';
