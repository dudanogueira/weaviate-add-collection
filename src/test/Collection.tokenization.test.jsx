/**
 * Tests for tokenization configuration.
 *
 * Covers the gse_ch tokenization method (Weaviate >= 1.34.0), which the
 * TypeScript client only surfaced in its v1.37 schema refresh even though the
 * server has accepted it since 1.34.0.
 */
import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Collection from '../components/Collection'

async function waitForRender(container) {
  await waitFor(() => {
    expect(container.querySelector('.json-block')).toBeTruthy()
  }, { timeout: 3000 })
}

function readJson(container) {
  return JSON.parse(container.querySelector('.json-block').textContent)
}

function tokenizationSelect() {
  return screen.getByText('Tokenization').parentElement.querySelector('select')
}

function optionFor(select, value) {
  return Array.from(select.options).find(o => o.value === value)
}

const withTextProperty = {
  class: 'Article',
  properties: [{ name: 'title', dataType: ['text'] }],
}

// ─── gse_ch dropdown option ───────────────────────────────────────────────────

describe('Collection — gse_ch tokenization option', () => {
  it('is offered in the tokenization dropdown', async () => {
    const { container } = render(<Collection initialJson={withTextProperty} />)
    await waitForRender(container)

    expect(optionFor(tokenizationSelect(), 'gse_ch')).toBeTruthy()
  })

  it('is enabled when no version is set', async () => {
    const { container } = render(<Collection initialJson={withTextProperty} />)
    await waitForRender(container)

    expect(optionFor(tokenizationSelect(), 'gse_ch').disabled).toBe(false)
  })

  it('is enabled for version >= 1.34.0', async () => {
    const { container } = render(<Collection initialJson={withTextProperty} weaviateVersion="1.34.0" />)
    await waitForRender(container)

    expect(optionFor(tokenizationSelect(), 'gse_ch').disabled).toBe(false)
  })

  it('is still enabled well above the minimum', async () => {
    const { container } = render(<Collection initialJson={withTextProperty} weaviateVersion="1.37.3" />)
    await waitForRender(container)

    expect(optionFor(tokenizationSelect(), 'gse_ch').disabled).toBe(false)
  })

  it('is disabled with help text one patch below the minimum', async () => {
    const { container } = render(<Collection initialJson={withTextProperty} weaviateVersion="1.33.9" />)
    await waitForRender(container)

    const option = optionFor(tokenizationSelect(), 'gse_ch')
    expect(option.disabled).toBe(true)
    expect(option.textContent).toContain('1.34.0')
  })

  it('does not disable the ungated built-in methods', async () => {
    const { container } = render(<Collection initialJson={withTextProperty} weaviateVersion="1.20.0" />)
    await waitForRender(container)

    const select = tokenizationSelect()
    for (const value of ['word', 'lowercase', 'whitespace', 'field']) {
      expect(optionFor(select, value).disabled).toBe(false)
    }
  })
})

// ─── Round-trip ───────────────────────────────────────────────────────────────

describe('Collection — gse_ch round-trip', () => {
  it('survives an import unchanged', async () => {
    const { container } = render(
      <Collection initialJson={{
        class: 'Article',
        properties: [{ name: 'title', dataType: ['text'], tokenization: 'gse_ch' }],
      }} />
    )
    await waitForRender(container)

    expect(readJson(container).properties[0].tokenization).toBe('gse_ch')
  })

  it('is emitted when picked in the UI', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection initialJson={withTextProperty} />)
    await waitForRender(container)

    await user.selectOptions(tokenizationSelect(), 'gse_ch')

    await waitFor(() => {
      expect(readJson(container).properties[0].tokenization).toBe('gse_ch')
    })
  })
})
