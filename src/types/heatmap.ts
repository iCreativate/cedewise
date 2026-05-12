export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical'

/** Insured / account the broker can narrow a quote to within a region cell. */
export type QuotableBusiness = {
  id: string
  name: string
  /** e.g. Retail, Office, SMME */
  segment?: string
  /** Street, node, or estate within the cell */
  location?: string
  /** Building / site type (e.g. office tower, warehouse) */
  property?: string
  /** Street-level address within the cell */
  address?: string
  /** Indicative total sums insured band for this named risk */
  tsiBand?: string
  /** Placement / underwriting note (mock or API) */
  summary?: string
  openClaims?: number
  policiesCount?: number
  lineOfBusiness?: string
}

/** Rich underwriting / placement context for a heatmap region (mock or API-backed). */
export type RegionRiskDetail = {
  municipality: string
  province: string
  summary: string
  predominantPerils: string[]
  indicativeExposure: string
  lossRatioBand: string
  activePolicies: number
  openClaims: number
  premiumBenchmark: string
  underwritingFocus: string[]
  reinsuranceAngle: string
  /** Optional line of business for quoting context */
  lineOfBusiness?: string
  /** Named risks in the cell; used to target a facultative quote */
  quotableBusinesses?: QuotableBusiness[]
}

export type HeatmapPoint = {
  lat: number
  lng: number
  intensity: number
  label: string
  risk: RiskLevel
  details?: RegionRiskDetail
}
