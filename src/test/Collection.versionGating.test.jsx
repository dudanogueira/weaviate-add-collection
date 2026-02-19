/**
 * Integration tests for version-gating behaviour through the Collection component.
 *
 * These tests complement the VersionContext.test.jsx unit tests by verifying
 * that version gates actually work end-to-end: the right sections are disabled,
 * the right dropdown options are marked disabled, and the right help text is
 * shown when a weaviateVersion prop is supplied to <Collection>.
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

// ─── Multi-Tenancy section (VersionGatedSection) ──────────────────────────────

describe('Collection — Multi-Tenancy section version gating', () => {
  it('section toggle is enabled when no version is set', async () => {
    const { container } = render(<Collection />)
    await waitForRender(container)

    const toggle = screen.getByText('Multi Tenancy Configuration').closest('button')
    expect(toggle).not.toBeDisabled()
  })

  it('section toggle is enabled for version >= 1.20.0', async () => {
    const { container } = render(<Collection weaviateVersion="1.20.0" />)
    await waitForRender(container)

    const toggle = screen.getByText('Multi Tenancy Configuration').closest('button')
    expect(toggle).not.toBeDisabled()
  })

  it('section toggle is disabled for version < 1.20.0', async () => {
    const { container } = render(<Collection weaviateVersion="1.19.9" />)
    await waitForRender(container)

    const toggle = screen.getByRole('button', { name: /multi tenancy configuration/i })
    expect(toggle).toBeDisabled()
  })

  it('shows version requirement text in the toggle when version is below 1.20.0', async () => {
    const { container } = render(<Collection weaviateVersion="1.19.0" />)
    await waitForRender(container)

    const toggle = screen.getByRole('button', { name: /multi tenancy configuration/i })
    expect(toggle.textContent).toContain('1.20.0')
    expect(toggle.textContent).toContain('Requires Weaviate')
  })

  it('does not render panel content when version is below 1.20.0', async () => {
    const { container } = render(<Collection weaviateVersion="1.19.0" />)
    await waitForRender(container)

    // "Enabled:" label only appears when the section is open and accessible
    expect(screen.queryByText(/^Enabled:$/)).not.toBeInTheDocument()
  })

  it('can open section and toggle MT enabled for version >= 1.20.0', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection weaviateVersion="1.25.0" />)
    await waitForRender(container)

    const toggle = screen.getByText('Multi Tenancy Configuration').closest('button')
    await user.click(toggle)

    await waitFor(() => {
      expect(screen.getByText(/^Enabled:$/)).toBeInTheDocument()
    })

    const enabledCheckbox = screen.getByText(/^Enabled:$/).parentElement.querySelector('input[type="checkbox"]')
    await user.click(enabledCheckbox)

    await waitFor(() => {
      const json = JSON.parse(container.querySelector('.json-block').textContent)
      expect(json.multiTenancyConfig?.enabled).toBe(true)
    })
  })
})

// ─── Index Type dropdown (useVersionFilteredOptions) ─────────────────────────

describe('Collection — Index Type dropdown version gating', () => {
  // Helper: open the Vectorizer Configuration section, add a vector config, then
  // click the Index Configuration tab inside the new item.
  async function openIndexConfigTab(user) {
    const sectionToggle = screen.getByRole('button', { name: /vectorizer configuration/i })
    if (sectionToggle.getAttribute('aria-expanded') !== 'true') {
      await user.click(sectionToggle)
    }
    await user.click(screen.getByRole('button', { name: /add vector config/i }))
    await waitFor(() => screen.getByRole('button', { name: /^index configuration$/i }))
    await user.click(screen.getByRole('button', { name: /^index configuration$/i }))
  }

  it('"Dynamic" option is enabled when no version is set', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection />)
    await waitForRender(container)

    await openIndexConfigTab(user)

    const select = container.querySelector('[id^="index-type-"]')
    const dynamicOption = Array.from(select.options).find(o => o.value === 'dynamic')
    expect(dynamicOption).toBeTruthy()
    expect(dynamicOption.disabled).toBe(false)
  })

  it('"Dynamic" option is enabled for version >= 1.25.0', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection weaviateVersion="1.25.0" />)
    await waitForRender(container)

    await openIndexConfigTab(user)

    const select = container.querySelector('[id^="index-type-"]')
    const dynamicOption = Array.from(select.options).find(o => o.value === 'dynamic')
    expect(dynamicOption.disabled).toBe(false)
  })

  it('"Dynamic" option is disabled with help text for version < 1.25.0', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection weaviateVersion="1.24.9" />)
    await waitForRender(container)

    await openIndexConfigTab(user)

    const select = container.querySelector('[id^="index-type-"]')
    const dynamicOption = Array.from(select.options).find(o => o.value === 'dynamic')
    expect(dynamicOption.disabled).toBe(true)
    expect(dynamicOption.textContent).toContain('1.25.0')
    expect(dynamicOption.textContent).toContain('Requires Weaviate')
  })

  it('"HNSW" and "Flat" options are never disabled regardless of version', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection weaviateVersion="1.0.0" />)
    await waitForRender(container)

    await openIndexConfigTab(user)

    const select = container.querySelector('[id^="index-type-"]')
    const hnswOption = Array.from(select.options).find(o => o.value === 'hnsw')
    const flatOption = Array.from(select.options).find(o => o.value === 'flat')
    expect(hnswOption.disabled).toBe(false)
    expect(flatOption.disabled).toBe(false)
  })
})

// ─── RQ quantizer dropdown (useVersionFilteredOptions) ────────────────────────

describe('Collection — RQ quantizer dropdown version gating', () => {
  // Helper: open the Vectorizer Configuration section, add a vector config, then
  // click the Compression/Quantization tab inside the new item.
  async function openCompressionTab(user) {
    const sectionToggle = screen.getByRole('button', { name: /vectorizer configuration/i })
    if (sectionToggle.getAttribute('aria-expanded') !== 'true') {
      await user.click(sectionToggle)
    }
    await user.click(screen.getByRole('button', { name: /add vector config/i }))
    await waitFor(() => screen.getByRole('button', { name: /compression\/quantization/i }))
    await user.click(screen.getByRole('button', { name: /compression\/quantization/i }))
  }

  it('"RQ" option is enabled when no version is set', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection />)
    await waitForRender(container)

    await openCompressionTab(user)

    const select = container.querySelector('[id^="compression-quantizer-"]')
    const rqOption = Array.from(select.options).find(o => o.value === 'rq')
    expect(rqOption).toBeTruthy()
    expect(rqOption.disabled).toBe(false)
  })

  it('"RQ" option is enabled for version >= 1.35.0', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection weaviateVersion="1.35.0" />)
    await waitForRender(container)

    await openCompressionTab(user)

    const select = container.querySelector('[id^="compression-quantizer-"]')
    const rqOption = Array.from(select.options).find(o => o.value === 'rq')
    expect(rqOption.disabled).toBe(false)
  })

  it('"RQ" option is disabled with help text for version < 1.35.0', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection weaviateVersion="1.34.9" />)
    await waitForRender(container)

    await openCompressionTab(user)

    const select = container.querySelector('[id^="compression-quantizer-"]')
    const rqOption = Array.from(select.options).find(o => o.value === 'rq')
    expect(rqOption.disabled).toBe(true)
    expect(rqOption.textContent).toContain('1.35.0')
    expect(rqOption.textContent).toContain('Requires Weaviate')
  })

  it('"PQ", "BQ", and "SQ" options are never disabled regardless of version', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection weaviateVersion="1.0.0" />)
    await waitForRender(container)

    await openCompressionTab(user)

    const select = container.querySelector('[id^="compression-quantizer-"]')
    const opts = Array.from(select.options)
    ;['pq', 'bq', 'sq'].forEach(val => {
      const opt = opts.find(o => o.value === val)
      if (opt) expect(opt.disabled).toBe(false)
    })
  })
})

// ─── autoTenantCreation / autoTenantActivation (VersionGated fields) ──────────

describe('Collection — autoTenantCreation/Activation field version gating', () => {
  async function openMTSectionAndEnable(user, container) {
    const toggle = screen.getByText('Multi Tenancy Configuration').closest('button')
    await user.click(toggle)
    await waitFor(() => screen.getByText(/^Enabled:$/))
    const enabledCheckbox = screen.getByText(/^Enabled:$/).parentElement.querySelector('input[type="checkbox"]')
    await user.click(enabledCheckbox)
    await waitFor(() => {
      const json = JSON.parse(container.querySelector('.json-block').textContent)
      expect(json.multiTenancyConfig?.enabled).toBe(true)
    })
  }

  it('autoTenantCreation field is accessible for version >= 1.25.2', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection weaviateVersion="1.25.2" />)
    await waitForRender(container)

    await openMTSectionAndEnable(user, container)

    // Field should be visible (VersionGated passes through as a fragment)
    expect(screen.getByText(/^Auto Tenant Creation:$/)).toBeInTheDocument()
    const checkbox = screen.getByText(/^Auto Tenant Creation:$/).parentElement.querySelector('input[type="checkbox"]')
    // Should not have a not-allowed overlay — the label itself should be reachable
    expect(checkbox).not.toBeNull()
  })

  it('autoTenantCreation field is rendered greyed-out for version < 1.25.2', async () => {
    const user = userEvent.setup()
    const { container } = render(<Collection weaviateVersion="1.20.0" />)
    await waitForRender(container)

    await openMTSectionAndEnable(user, container)

    // The field still renders (VersionGated shows it, just with an overlay)
    expect(screen.getByText(/^Auto Tenant Creation:$/)).toBeInTheDocument()

    // The container div should have the version tooltip attribute
    const label = screen.getByText(/^Auto Tenant Creation:$/)
    const tooltipWrapper = label.closest('[data-version-tooltip]')
    expect(tooltipWrapper).not.toBeNull()
    expect(tooltipWrapper.getAttribute('data-version-tooltip')).toContain('1.25.2')
  })
})
