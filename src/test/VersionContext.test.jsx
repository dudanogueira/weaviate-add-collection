import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {
  VersionProvider,
  useVersionFeature,
  useVersionFilteredOptions,
  VersionGated,
  VersionGatedSection,
} from '../context/VersionContext'

// Wraps children in a VersionProvider with a given version
function makeWrapper(version) {
  return ({ children }) => (
    <VersionProvider weaviateVersion={version}>{children}</VersionProvider>
  )
}

// ─── useVersionFeature ────────────────────────────────────────────────────────

describe('useVersionFeature', () => {
  it('returns available=true when no version is set', () => {
    const { result } = renderHook(() => useVersionFeature('multiTenancy'), {
      wrapper: makeWrapper(null),
    })
    expect(result.current.available).toBe(true)
    expect(result.current.tooltip).toBe('')
  })

  it('returns available=true when version exactly meets the minimum', () => {
    const { result } = renderHook(() => useVersionFeature('multiTenancy'), {
      wrapper: makeWrapper('1.20.0'),
    })
    expect(result.current.available).toBe(true)
    expect(result.current.tooltip).toBe('')
  })

  it('returns available=true when version exceeds the minimum', () => {
    const { result } = renderHook(() => useVersionFeature('multiTenancy'), {
      wrapper: makeWrapper('2.0.0'),
    })
    expect(result.current.available).toBe(true)
  })

  it('returns available=false and correct tooltip when version is below minimum', () => {
    const { result } = renderHook(() => useVersionFeature('multiTenancy'), {
      wrapper: makeWrapper('1.19.9'),
    })
    expect(result.current.available).toBe(false)
    expect(result.current.tooltip).toBe('Requires Weaviate \u2265 1.20.0')
    expect(result.current.minVersion).toBe('1.20.0')
  })

  it('returns available=true for unknown featureId (graceful degradation)', () => {
    const { result } = renderHook(() => useVersionFeature('noSuchFeature'), {
      wrapper: makeWrapper('1.0.0'),
    })
    expect(result.current.available).toBe(true)
    expect(result.current.minVersion).toBeNull()
  })

  it('works correctly for rqQuantizationHnsw (min 1.35.0)', () => {
    const below = renderHook(() => useVersionFeature('rqQuantizationHnsw'), {
      wrapper: makeWrapper('1.34.0'),
    })
    expect(below.result.current.available).toBe(false)
    expect(below.result.current.tooltip).toBe('Requires Weaviate \u2265 1.35.0')

    const at = renderHook(() => useVersionFeature('rqQuantizationHnsw'), {
      wrapper: makeWrapper('1.35.0'),
    })
    expect(at.result.current.available).toBe(true)
  })
})

// ─── useVersionFilteredOptions ────────────────────────────────────────────────

describe('useVersionFilteredOptions', () => {
  const options = [
    { value: 'always', label: 'Always Available' },
    { value: 'mt', label: 'Multi-Tenancy Option', featureId: 'multiTenancy' },     // min 1.20.0
    { value: 'rq', label: 'RQ HNSW Option', featureId: 'rqQuantizationHnsw' },    // min 1.35.0
  ]

  it('returns options unchanged when no version is set', () => {
    const { result } = renderHook(() => useVersionFilteredOptions(options), {
      wrapper: makeWrapper(null),
    })
    expect(result.current).toEqual(options)
  })

  it('returns all options without disabled flags when version meets all minimums', () => {
    const { result } = renderHook(() => useVersionFilteredOptions(options), {
      wrapper: makeWrapper('2.0.0'),
    })
    expect(result.current.every(o => !o.disabled)).toBe(true)
    expect(result.current.every(o => !o.helpText)).toBe(true)
  })

  it('never disables options without a featureId', () => {
    const { result } = renderHook(() => useVersionFilteredOptions(options), {
      wrapper: makeWrapper('0.1.0'),
    })
    const alwaysOpt = result.current.find(o => o.value === 'always')
    expect(alwaysOpt.disabled).toBeUndefined()
    expect(alwaysOpt.helpText).toBeUndefined()
  })

  it('marks an option disabled with helpText when version is below its minimum', () => {
    const { result } = renderHook(() => useVersionFilteredOptions(options), {
      wrapper: makeWrapper('1.19.0'),
    })
    const mtOpt = result.current.find(o => o.value === 'mt')
    expect(mtOpt.disabled).toBe(true)
    expect(mtOpt.helpText).toBe('Requires Weaviate \u2265 1.20.0')
  })

  it('marks only options that fail the version check (mixed result)', () => {
    // version 1.25.0: mt (1.20.0) is OK, rq (1.35.0) is NOT
    const { result } = renderHook(() => useVersionFilteredOptions(options), {
      wrapper: makeWrapper('1.25.0'),
    })
    expect(result.current.find(o => o.value === 'always').disabled).toBeUndefined()
    expect(result.current.find(o => o.value === 'mt').disabled).toBeUndefined()
    const rqOpt = result.current.find(o => o.value === 'rq')
    expect(rqOpt.disabled).toBe(true)
    expect(rqOpt.helpText).toBe('Requires Weaviate \u2265 1.35.0')
  })

  it('preserves all original properties on a disabled option', () => {
    const { result } = renderHook(() => useVersionFilteredOptions(options), {
      wrapper: makeWrapper('1.0.0'),
    })
    const mtOpt = result.current.find(o => o.value === 'mt')
    expect(mtOpt.value).toBe('mt')
    expect(mtOpt.label).toBe('Multi-Tenancy Option')
    expect(mtOpt.featureId).toBe('multiTenancy')
    expect(mtOpt.disabled).toBe(true)
    expect(mtOpt.helpText).toBeDefined()
  })

  it('returns the original option object reference when available', () => {
    const { result } = renderHook(() => useVersionFilteredOptions(options), {
      wrapper: makeWrapper('2.0.0'),
    })
    // Same references (no spread) for available options
    expect(result.current[0]).toBe(options[0])
    expect(result.current[1]).toBe(options[1])
  })
})

// ─── VersionGated ─────────────────────────────────────────────────────────────

describe('VersionGated', () => {
  it('renders children in a plain fragment when feature is available', () => {
    render(
      <VersionProvider weaviateVersion="1.30.0">
        <VersionGated featureId="multiTenancy">
          <span data-testid="child">Content</span>
        </VersionGated>
      </VersionProvider>
    )
    const child = screen.getByTestId('child')
    expect(child).toBeInTheDocument()
    // When available, no data-version-tooltip wrapper is present
    expect(child.closest('[data-version-tooltip]')).toBeNull()
  })

  it('wraps content with overlay and tooltip when feature is not available', () => {
    render(
      <VersionProvider weaviateVersion="1.19.0">
        <VersionGated featureId="multiTenancy">
          <span data-testid="child">Content</span>
        </VersionGated>
      </VersionProvider>
    )
    const child = screen.getByTestId('child')
    expect(child).toBeInTheDocument()
    const tooltipWrapper = child.closest('[data-version-tooltip]')
    expect(tooltipWrapper).not.toBeNull()
    expect(tooltipWrapper.getAttribute('data-version-tooltip')).toBe(
      'Requires Weaviate \u2265 1.20.0'
    )
  })

  it('renders children normally when no version is set', () => {
    render(
      <VersionProvider weaviateVersion={null}>
        <VersionGated featureId="multiTenancy">
          <span data-testid="child">Content</span>
        </VersionGated>
      </VersionProvider>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByTestId('child').closest('[data-version-tooltip]')).toBeNull()
  })
})

// ─── VersionGatedSection ──────────────────────────────────────────────────────

describe('VersionGatedSection', () => {
  it('renders an enabled toggle button when feature is available', () => {
    render(
      <VersionProvider weaviateVersion="1.20.0">
        <VersionGatedSection featureId="multiTenancy" title="My Section" isOpen={false} onToggle={() => {}}>
          <span data-testid="content">Panel</span>
        </VersionGatedSection>
      </VersionProvider>
    )
    const btn = screen.getByRole('button', { name: /my section/i })
    expect(btn).not.toBeDisabled()
  })

  it('does not render panel content when isOpen is false', () => {
    render(
      <VersionProvider weaviateVersion="1.20.0">
        <VersionGatedSection featureId="multiTenancy" title="My Section" isOpen={false} onToggle={() => {}}>
          <span data-testid="content">Panel</span>
        </VersionGatedSection>
      </VersionProvider>
    )
    expect(screen.queryByTestId('content')).not.toBeInTheDocument()
  })

  it('renders panel content when isOpen is true and feature is available', () => {
    render(
      <VersionProvider weaviateVersion="1.20.0">
        <VersionGatedSection featureId="multiTenancy" title="My Section" isOpen={true} onToggle={() => {}}>
          <span data-testid="content">Panel</span>
        </VersionGatedSection>
      </VersionProvider>
    )
    expect(screen.getByTestId('content')).toBeInTheDocument()
  })

  it('calls onToggle when the button is clicked and feature is available', async () => {
    const user = userEvent.setup()
    let toggled = false
    render(
      <VersionProvider weaviateVersion="1.25.0">
        <VersionGatedSection featureId="multiTenancy" title="My Section" isOpen={false} onToggle={() => { toggled = true }}>
          <span>Panel</span>
        </VersionGatedSection>
      </VersionProvider>
    )
    await user.click(screen.getByRole('button', { name: /my section/i }))
    expect(toggled).toBe(true)
  })

  it('renders a disabled button with version text when feature is not available', () => {
    render(
      <VersionProvider weaviateVersion="1.19.0">
        <VersionGatedSection featureId="multiTenancy" title="My Section" isOpen={false} onToggle={() => {}}>
          <span data-testid="content">Panel</span>
        </VersionGatedSection>
      </VersionProvider>
    )
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn.textContent).toContain('My Section')
    expect(btn.textContent).toContain('Requires Weaviate \u2265 1.20.0')
  })

  it('does not render panel content when feature is not available, even when isOpen=true', () => {
    render(
      <VersionProvider weaviateVersion="1.19.0">
        <VersionGatedSection featureId="multiTenancy" title="My Section" isOpen={true} onToggle={() => {}}>
          <span data-testid="content">Panel</span>
        </VersionGatedSection>
      </VersionProvider>
    )
    expect(screen.queryByTestId('content')).not.toBeInTheDocument()
  })

  it('renders with enabled toggle and no version text when no version is set', () => {
    render(
      <VersionProvider weaviateVersion={null}>
        <VersionGatedSection featureId="multiTenancy" title="My Section" isOpen={false} onToggle={() => {}}>
          <span>Panel</span>
        </VersionGatedSection>
      </VersionProvider>
    )
    const btn = screen.getByRole('button', { name: /my section/i })
    expect(btn).not.toBeDisabled()
    expect(btn.textContent).not.toContain('Requires Weaviate')
  })

  it('toggle button reflects open/closed state via aria-expanded', () => {
    const { rerender } = render(
      <VersionProvider weaviateVersion="1.25.0">
        <VersionGatedSection featureId="multiTenancy" title="My Section" isOpen={false} onToggle={() => {}}>
          <span>Panel</span>
        </VersionGatedSection>
      </VersionProvider>
    )
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('false')

    rerender(
      <VersionProvider weaviateVersion="1.25.0">
        <VersionGatedSection featureId="multiTenancy" title="My Section" isOpen={true} onToggle={() => {}}>
          <span>Panel</span>
        </VersionGatedSection>
      </VersionProvider>
    )
    expect(screen.getByRole('button').getAttribute('aria-expanded')).toBe('true')
  })
})
