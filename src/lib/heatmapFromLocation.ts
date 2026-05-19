import type { GeocodeResult } from '@/lib/geocode'
import type { HeatmapPoint } from '@/types/heatmap'

/** Build a quotable heatmap cell from a user-searched place (anywhere in the world). */
export function createHeatmapPointFromSearch(result: GeocodeResult): HeatmapPoint {
  const label = result.shortLabel || result.municipality
  const provinceLabel = [result.region, result.country].filter(Boolean).join(', ') || result.country || '—'
  const slug = `search-${result.lat.toFixed(4)}-${result.lng.toFixed(4)}`.replace(/[^a-z0-9-]/gi, '-')

  return {
    lat: result.lat,
    lng: result.lng,
    intensity: 0.55,
    label,
    risk: 'Medium',
    isSearchLocation: true,
    details: {
      municipality: result.municipality,
      province: provinceLabel,
      summary: `Location selected for quoting: ${result.displayName}. This is outside the pre-loaded Gauteng portfolio heat layer — use the dossier below to start a new facultative placement with Street View and map context.`,
      predominantPerils: ['Fire & allied perils', 'Business interruption', 'Nat-cat (verify locally)', 'Liability'],
      indicativeExposure: 'To be confirmed — new business',
      lossRatioBand: 'N/A — greenfield location',
      activePolicies: 0,
      openClaims: 0,
      premiumBenchmark: 'Subject to local rating and occupancy',
      underwritingFocus: [
        'Confirm occupancy, construction, and sums insured for this address.',
        'Validate local catastrophe and regulatory requirements.',
        'Obtain loss history and engineering surveys where available.',
      ],
      reinsuranceAngle:
        'Treat as facultative new business; align layer structure with Cedewise guidelines for the territory.',
      lineOfBusiness: 'Commercial property (non-life facultative)',
      quotableBusinesses: [
        {
          id: `${slug}-all`,
          name: `New placement — ${label}`,
          segment: 'Commercial property',
          property: 'Insured premises at searched location',
          address: result.displayName,
          location: label,
          tsiBand: 'TBC — enter on quote form',
          summary:
            'Primary quote target for this searched location. Open proportional or non-proportional facultative to bind terms.',
          policiesCount: 0,
          openClaims: 0,
          lineOfBusiness: 'Commercial property',
        },
        {
          id: `${slug}-site`,
          name: `Site risk — ${result.municipality}`,
          segment: 'Named location',
          property: 'Single-site commercial risk',
          address: result.displayName,
          location: result.municipality,
          tsiBand: 'TBC',
          summary: 'Named-risk slice at the geocoded coordinates; use when quoting a specific building or campus.',
          policiesCount: 0,
          openClaims: 0,
          lineOfBusiness: 'Commercial property',
        },
      ],
    },
  }
}
