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
