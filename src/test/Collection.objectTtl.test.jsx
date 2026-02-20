import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Collection from '../components/Collection'

async function waitForRender(container) {
  await waitFor(() => {
    expect(container.querySelector('.json-block')).toBeTruthy()
  }, { timeout: 3000 })
}

function getJson(container) {
  return JSON.parse(container.querySelector('.json-block').textContent)
}

async function openTtlSection(user) {
  const toggle = screen.getByRole('button', { name: /object time to live/i })
  await user.click(toggle)
  await waitFor(() => screen.getByText(/^Delete On:$/))
}

// ─── Version gating ───────────────────────────────────────────────────────────

describe('Collection — Object TTL section version gating', () => {
  it('section is enabled when no version is set', async () => {
    const { container } = render(<Collection />)
    await waitForRender(container)

    const toggle = screen.getByRole('button', { name: /object time to live/i })
    expect(toggle).not.toBeDisabled()
  })

  it('section is enabled for version >= 1.35.0', async () => {
    const { container } = render(<Collection weaviateVersion="1.35.0" />)
    await waitForRender(container)

    const toggle = screen.getByRole('button', { name: /object time to live/i })
    expect(toggle).not.toBeDisabled()
  })

  it('section is disabled for version < 1.35.0', async () => {
    const { container } = render(<Collection weaviateVersion="1.34.9" />)
    await waitForRender(container)

    const toggle = screen.getByRole('button', { name: /object time to live/i })
    expect(toggle).toBeDisabled()
  })

  it('shows version requirement text in toggle when below 1.35.0', async () => {
    const { container } = render(<Collection weaviateVersion="1.34.0" />)
    await waitForRender(container)

    const toggle = screen.getByRole('button', { name: /object time to live/i })
    expect(toggle.textContent).toContain('1.35.0')
    expect(toggle.textContent).toContain('Requires Weaviate')
  })

  it('does not render section content when version is below 1.35.0', async () => {
    const { container } = render(<Collection weaviateVersion="1.34.0" />)
    await waitForRender(container)

    expect(screen.queryByText(/^Delete On:$/)).not.toBeInTheDocument()
  })
})

// ─── JSON output ──────────────────────────────────────────────────────────────

describe('Collection — Object TTL JSON output', () => {
  it('omits objectTtlConfig from JSON when mode is none (default)', async () => {
    const { container } = render(<Collection weaviateVersion="1.35.0" />)
    await waitForRender(container)

    expect(getJson(container).objectTtlConfig).toBeUndefined()
  })

  it('generates correct JSON for creationTime mode', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection weaviateVersion="1.35.0" />)
    await waitForRender(container)

    await openTtlSection(user)

    const deleteOnSelect = screen.getByText(/^Delete On:$/).closest('.field').querySelector('select')
    await user.selectOptions(deleteOnSelect, 'creationTime')

    await waitFor(() => screen.getByText(/^Time to Live \(seconds\):$/))

    const ttlInput = screen.getByText(/^Time to Live \(seconds\):$/).closest('.field').querySelector('input[type="number"]')
    await user.clear(ttlInput)
    await user.type(ttlInput, '3600')

    const filterCheckbox = screen.getByText(/^Filter Expired Objects:$/).closest('.field').querySelector('input[type="checkbox"]')
    await user.click(filterCheckbox)

    await waitFor(() => {
      const json = getJson(container)
      expect(json.objectTtlConfig).toMatchObject({
        enabled: true,
        deleteOn: 'creationTime',
        timeToLive: 3600,
        filterExpiredObjects: true,
      })
    })
  })

  it('generates correct JSON for updateTime mode', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection weaviateVersion="1.35.0" />)
    await waitForRender(container)

    await openTtlSection(user)

    const deleteOnSelect = screen.getByText(/^Delete On:$/).closest('.field').querySelector('select')
    await user.selectOptions(deleteOnSelect, 'updateTime')

    await waitFor(() => screen.getByText(/^Time to Live \(seconds\):$/))

    const ttlInput = screen.getByText(/^Time to Live \(seconds\):$/).closest('.field').querySelector('input[type="number"]')
    await user.clear(ttlInput)
    await user.type(ttlInput, '7200')

    await waitFor(() => {
      const json = getJson(container)
      expect(json.objectTtlConfig).toMatchObject({
        enabled: true,
        deleteOn: 'updateTime',
        timeToLive: 7200,
      })
    })
  })

  it('omits objectTtlConfig when dateProperty mode but no property selected', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection weaviateVersion="1.35.0" />)
    await waitForRender(container)

    await openTtlSection(user)

    const deleteOnSelect = screen.getByText(/^Delete On:$/).closest('.field').querySelector('select')
    await user.selectOptions(deleteOnSelect, 'dateProperty')

    await waitFor(() => screen.getByText(/^Date Property:$/))

    // No property chosen — deleteOn would be '' so the key should be absent
    await waitFor(() => {
      expect(getJson(container).objectTtlConfig).toBeUndefined()
    })
  })

  it('uses the selected property name as deleteOn in dateProperty mode', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection
      weaviateVersion="1.35.0"
      initialJson={{
        class: 'TestTtl',
        properties: [{ name: 'reference_date', dataType: ['date'] }],
        vectorConfig: { default: { vectorizer: { none: {} }, vectorIndexType: 'hnsw' } },
      }}
    />)
    await waitForRender(container)

    await openTtlSection(user)

    const deleteOnSelect = screen.getByText(/^Delete On:$/).closest('.field').querySelector('select')
    await user.selectOptions(deleteOnSelect, 'dateProperty')

    await waitFor(() => screen.getByText(/^Date Property:$/))

    const propSelect = screen.getByText(/^Date Property:$/).closest('.field').querySelector('select')
    await user.selectOptions(propSelect, 'reference_date')

    await waitFor(() => {
      const json = getJson(container)
      expect(json.objectTtlConfig).toMatchObject({
        enabled: true,
        deleteOn: 'reference_date',
      })
    })
  })

  it('switching back to none removes objectTtlConfig from JSON', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection weaviateVersion="1.35.0" />)
    await waitForRender(container)

    await openTtlSection(user)

    const deleteOnSelect = screen.getByText(/^Delete On:$/).closest('.field').querySelector('select')
    await user.selectOptions(deleteOnSelect, 'creationTime')
    await waitFor(() => {
      expect(getJson(container).objectTtlConfig).toBeDefined()
    })

    await user.selectOptions(deleteOnSelect, 'none')
    await waitFor(() => {
      expect(getJson(container).objectTtlConfig).toBeUndefined()
    })
  })
})

// ─── Import from initialJson ──────────────────────────────────────────────────

describe('Collection — Object TTL import from initialJson', () => {
  const baseJson = {
    vectorConfig: { default: { vectorizer: { none: {} }, vectorIndexType: 'hnsw' } },
  }

  it('imports creationTime config correctly', async () => {
    const { container } = render(<Collection initialJson={{
      class: 'TestImport',
      properties: [],
      ...baseJson,
      objectTtlConfig: {
        enabled: true,
        deleteOn: 'creationTime',
        timeToLive: 3600,
        filterExpiredObjects: true,
      },
    }} />)
    await waitForRender(container)

    expect(getJson(container).objectTtlConfig).toMatchObject({
      enabled: true,
      deleteOn: 'creationTime',
      timeToLive: 3600,
      filterExpiredObjects: true,
    })
  })

  it('imports updateTime config correctly', async () => {
    const { container } = render(<Collection initialJson={{
      class: 'TestImport',
      properties: [],
      ...baseJson,
      objectTtlConfig: {
        enabled: true,
        deleteOn: 'updateTime',
        timeToLive: 7200,
        filterExpiredObjects: false,
      },
    }} />)
    await waitForRender(container)

    expect(getJson(container).objectTtlConfig).toMatchObject({
      enabled: true,
      deleteOn: 'updateTime',
      timeToLive: 7200,
      filterExpiredObjects: false,
    })
  })

  it('imports a property-name deleteOn and re-exports it unchanged', async () => {
    const { container } = render(<Collection initialJson={{
      class: 'TestImport',
      properties: [{ name: 'reference_date', dataType: ['date'] }],
      ...baseJson,
      objectTtlConfig: {
        enabled: true,
        deleteOn: 'reference_date',
        timeToLive: 123,
        filterExpiredObjects: true,
      },
    }} />)
    await waitForRender(container)

    expect(getJson(container).objectTtlConfig).toMatchObject({
      enabled: true,
      deleteOn: 'reference_date',
      timeToLive: 123,
      filterExpiredObjects: true,
    })
  })
})
