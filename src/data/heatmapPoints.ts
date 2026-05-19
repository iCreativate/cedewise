import type { HeatmapPoint, RegionRiskDetail, RiskLevel } from '@/types/heatmap'

function detail(
  partial: Partial<RegionRiskDetail> & Pick<RegionRiskDetail, 'municipality' | 'province' | 'summary'>
): RegionRiskDetail {
  return {
    predominantPerils: ['Fire & allied perils', 'Business interruption', 'Theft'],
    indicativeExposure: 'R 200M – R 800M',
    lossRatioBand: '42% – 58%',
    activePolicies: 85,
    openClaims: 8,
    premiumBenchmark: '0.55% – 0.95% of TSI (indicative)',
    underwritingFocus: [
      'Validate occupancy and sums insured for this territory.',
      'Confirm local catastrophe and regulatory requirements.',
      'Review loss history and engineering evidence where available.',
    ],
    reinsuranceAngle: 'Facultative placement opportunity — align terms with Cedewise guidelines for the region.',
    lineOfBusiness: 'Commercial property (non-life facultative)',
    quotableBusinesses: [
      {
        id: `${partial.municipality}-portfolio`.replace(/\s+/g, '-').toLowerCase(),
        name: `Regional portfolio — ${partial.municipality}`,
        segment: 'Portfolio',
      },
      {
        id: `${partial.municipality}-primary`.replace(/\s+/g, '-').toLowerCase(),
        name: `Primary commercial risk — ${partial.municipality}`,
        segment: 'Commercial property',
      },
    ],
    ...partial,
  }
}

function globalPoint(
  lat: number,
  lng: number,
  label: string,
  municipality: string,
  province: string,
  risk: RiskLevel,
  intensity: number
): HeatmapPoint {
  const slug = label.replace(/\s+/g, '-').toLowerCase()
  return {
    lat,
    lng,
    intensity,
    label,
    risk,
    details: detail({
      municipality,
      province,
      summary: `Active quoting corridor for ${label}. Portfolio heat indicates facultative opportunity across commercial and industrial risks in this market.`,
    }),
  }
}

/** Detailed Gauteng cells (rich dossiers). */
export const GAUTENG_HEATMAP_POINTS: HeatmapPoint[] = [
  {
    lat: -26.2041,
    lng: 28.0473,
    intensity: 0.95,
    label: 'Johannesburg CBD',
    risk: 'Critical',
    details: {
      municipality: 'Johannesburg',
      province: 'Gauteng, South Africa',
      summary:
        'Dense CBD commercial stack with elevated BI accumulation and concentration of high-value retail and offices.',
      predominantPerils: ['Fire', 'BI / CBI', 'Political violence spillover', 'Theft'],
      indicativeExposure: 'R 2.4B – R 3.6B',
      lossRatioBand: '72% – 88%',
      activePolicies: 412,
      openClaims: 38,
      premiumBenchmark: '1.05% – 1.45% of TSI (indicative)',
      underwritingFocus: [
        'Demand updated valuations and sprinkler inspection certificates.',
        'Map BI indemnity vs. realistic maximum indemnity period.',
      ],
      reinsuranceAngle: 'Strong case for facultative top-up before binding primary renewals.',
      lineOfBusiness: 'CBD commercial property',
      quotableBusinesses: [
        { id: 'jhb-cbd-all', name: 'Full CBD cell (aggregated portfolio)', segment: 'Portfolio' },
        { id: 'jhb-cbd-1', name: 'Carlton Centre — retail & upper offices', segment: 'Retail / office' },
      ],
    },
  },
  {
    lat: -26.1076,
    lng: 28.0567,
    intensity: 0.75,
    label: 'Sandton',
    risk: 'High',
    details: {
      municipality: 'Sandton',
      province: 'Gauteng, South Africa',
      summary: 'Premium office and mixed-use node with sustained placement activity.',
      predominantPerils: ['Fire & allied perils', 'Business interruption', 'Theft'],
      indicativeExposure: 'R 1.1B – R 2.0B',
      lossRatioBand: '58% – 72%',
      activePolicies: 318,
      openClaims: 22,
      premiumBenchmark: '0.55% – 0.95% of TSI (indicative)',
      underwritingFocus: ['Water damage and power-surge BI review.'],
      reinsuranceAngle: 'Layered programme with nat-cat sub-limits recommended.',
      lineOfBusiness: 'Office / mixed-use',
      quotableBusinesses: [
        { id: 'sdn-all', name: 'Full Sandton cell (aggregated)', segment: 'Portfolio' },
        { id: 'sdn-1', name: 'Sandton City — super-regional mall', segment: 'Retail' },
      ],
    },
  },
  {
    lat: -26.1451,
    lng: 28.0341,
    intensity: 0.65,
    label: 'Rosebank',
    risk: 'High',
    details: detail({
      municipality: 'Rosebank',
      province: 'Gauteng, South Africa',
      summary: 'Mid-rise commercial hub with retail podiums; aggregation with adjacent nodes on the same grid.',
      indicativeExposure: 'R 720M – R 1.4B',
      activePolicies: 256,
      openClaims: 17,
    }),
  },
  {
    lat: -26.2678,
    lng: 27.8585,
    intensity: 0.55,
    label: 'Soweto',
    risk: 'Medium',
    details: detail({
      municipality: 'Soweto',
      province: 'Gauteng, South Africa',
      summary: 'Residential and light commercial mix with fire, weather, and liability drivers.',
      predominantPerils: ['Fire', 'Weather', 'Liability'],
      indicativeExposure: 'R 180M – R 520M',
      activePolicies: 540,
      openClaims: 31,
      lineOfBusiness: 'Residential / SMME',
    }),
  },
  {
    lat: -26.3225,
    lng: 28.1237,
    intensity: 0.45,
    label: 'Alberton',
    risk: 'Medium',
    details: detail({
      municipality: 'Alberton',
      province: 'Gauteng, South Africa',
      summary: 'Industrial fringe and logistics exposure along highway corridors.',
      lineOfBusiness: 'Industrial / logistics',
    }),
  },
  {
    lat: -26.1883,
    lng: 28.3208,
    intensity: 0.35,
    label: 'Benoni',
    risk: 'Low',
    details: detail({
      municipality: 'Benoni',
      province: 'Gauteng, South Africa',
      summary: 'Lower heat intensity cell suitable for cleaner primary terms.',
      indicativeExposure: 'R 90M – R 240M',
      lossRatioBand: '32% – 46%',
      activePolicies: 142,
      openClaims: 6,
    }),
  },
  globalPoint(-25.7479, 28.2293, 'Pretoria', 'Pretoria', 'Gauteng, South Africa', 'High', 0.68),
  globalPoint(-26.04, 28.08, 'Midrand', 'Midrand', 'Gauteng, South Africa', 'Medium', 0.52),
  globalPoint(-26.093, 27.975, 'Randburg', 'Randburg', 'Gauteng, South Africa', 'Medium', 0.48),
  globalPoint(-26.67, 27.93, 'Vereeniging', 'Vereeniging', 'Gauteng, South Africa', 'Medium', 0.42),
]

/** Worldwide dummy hotspots — potential quoting opportunities. */
export const WORLDWIDE_HEATMAP_POINTS: HeatmapPoint[] = [
  // Africa
  globalPoint(-33.9249, 18.4241, 'Cape Town', 'Cape Town', 'Western Cape, South Africa', 'High', 0.72),
  globalPoint(-29.8587, 31.0218, 'Durban', 'Durban', 'KwaZulu-Natal, South Africa', 'High', 0.7),
  globalPoint(-15.3875, 28.3228, 'Lusaka', 'Lusaka', 'Zambia', 'Medium', 0.48),
  globalPoint(-1.2921, 36.8219, 'Nairobi', 'Nairobi', 'Kenya', 'High', 0.74),
  globalPoint(6.5244, 3.3792, 'Lagos', 'Lagos', 'Nigeria', 'Critical', 0.88),
  globalPoint(30.0444, 31.2357, 'Cairo', 'Cairo', 'Egypt', 'High', 0.76),
  globalPoint(33.5731, -7.5898, 'Casablanca', 'Casablanca', 'Morocco', 'Medium', 0.55),
  globalPoint(5.6037, -0.187, 'Accra', 'Accra', 'Ghana', 'Medium', 0.58),
  globalPoint(-4.0435, 39.6682, 'Mombasa', 'Mombasa', 'Kenya', 'Medium', 0.5),
  globalPoint(-17.8252, 31.053, 'Harare', 'Harare', 'Zimbabwe', 'Medium', 0.45),

  // Europe
  globalPoint(51.5074, -0.1278, 'London', 'London', 'United Kingdom', 'Critical', 0.92),
  globalPoint(48.8566, 2.3522, 'Paris', 'Paris', 'France', 'High', 0.8),
  globalPoint(52.52, 13.405, 'Berlin', 'Berlin', 'Germany', 'High', 0.78),
  globalPoint(52.3676, 4.9041, 'Amsterdam', 'Amsterdam', 'Netherlands', 'High', 0.73),
  globalPoint(40.4168, -3.7038, 'Madrid', 'Madrid', 'Spain', 'High', 0.71),
  globalPoint(41.9028, 12.4964, 'Rome', 'Rome', 'Italy', 'High', 0.69),
  globalPoint(50.0755, 14.4378, 'Prague', 'Prague', 'Czech Republic', 'Medium', 0.52),
  globalPoint(59.3293, 18.0686, 'Stockholm', 'Stockholm', 'Sweden', 'Medium', 0.54),
  globalPoint(55.7558, 37.6173, 'Moscow', 'Moscow', 'Russia', 'High', 0.7),
  globalPoint(41.0082, 28.9784, 'Istanbul', 'Istanbul', 'Türkiye', 'High', 0.77),
  globalPoint(53.3498, -6.2603, 'Dublin', 'Dublin', 'Ireland', 'Medium', 0.56),
  globalPoint(60.1699, 24.9384, 'Helsinki', 'Helsinki', 'Finland', 'Low', 0.38),
  globalPoint(50.8503, 4.3517, 'Brussels', 'Brussels', 'Belgium', 'Medium', 0.57),

  // Americas
  globalPoint(40.7128, -74.006, 'New York', 'New York', 'United States', 'Critical', 0.94),
  globalPoint(34.0522, -118.2437, 'Los Angeles', 'Los Angeles', 'United States', 'High', 0.82),
  globalPoint(41.8781, -87.6298, 'Chicago', 'Chicago', 'United States', 'High', 0.79),
  globalPoint(25.7617, -80.1918, 'Miami', 'Miami', 'United States', 'High', 0.75),
  globalPoint(43.6532, -79.3832, 'Toronto', 'Toronto', 'Canada', 'High', 0.76),
  globalPoint(19.4326, -99.1332, 'Mexico City', 'Mexico City', 'Mexico', 'High', 0.81),
  globalPoint(-23.5505, -46.6333, 'São Paulo', 'São Paulo', 'Brazil', 'Critical', 0.9),
  globalPoint(-34.6037, -58.3816, 'Buenos Aires', 'Buenos Aires', 'Argentina', 'High', 0.74),
  globalPoint(-33.4489, -70.6693, 'Santiago', 'Santiago', 'Chile', 'High', 0.72),
  globalPoint(4.711, -74.0721, 'Bogotá', 'Bogotá', 'Colombia', 'Medium', 0.6),
  globalPoint(-12.0464, -77.0428, 'Lima', 'Lima', 'Peru', 'Medium', 0.58),
  globalPoint(45.5017, -73.5673, 'Montreal', 'Montreal', 'Canada', 'Medium', 0.55),

  // Middle East
  globalPoint(25.2048, 55.2708, 'Dubai', 'Dubai', 'UAE', 'Critical', 0.91),
  globalPoint(24.4539, 54.3773, 'Abu Dhabi', 'Abu Dhabi', 'UAE', 'High', 0.78),
  globalPoint(24.7136, 46.6753, 'Riyadh', 'Riyadh', 'Saudi Arabia', 'High', 0.8),
  globalPoint(31.7683, 35.2137, 'Jerusalem', 'Jerusalem', 'Israel', 'High', 0.7),
  globalPoint(33.8938, 35.5018, 'Beirut', 'Beirut', 'Lebanon', 'Medium', 0.52),
  globalPoint(29.3759, 47.9774, 'Kuwait City', 'Kuwait City', 'Kuwait', 'Medium', 0.54),

  // Asia-Pacific
  globalPoint(35.6762, 139.6503, 'Tokyo', 'Tokyo', 'Japan', 'Critical', 0.93),
  globalPoint(1.3521, 103.8198, 'Singapore', 'Singapore', 'Singapore', 'Critical', 0.89),
  globalPoint(22.3193, 114.1694, 'Hong Kong', 'Hong Kong', 'China', 'Critical', 0.9),
  globalPoint(31.2304, 121.4737, 'Shanghai', 'Shanghai', 'China', 'Critical', 0.92),
  globalPoint(19.076, 72.8777, 'Mumbai', 'Mumbai', 'India', 'Critical', 0.88),
  globalPoint(28.6139, 77.209, 'New Delhi', 'New Delhi', 'India', 'High', 0.82),
  globalPoint(13.7563, 100.5018, 'Bangkok', 'Bangkok', 'Thailand', 'High', 0.76),
  globalPoint(14.5995, 120.9842, 'Manila', 'Manila', 'Philippines', 'High', 0.73),
  globalPoint(37.5665, 126.978, 'Seoul', 'Seoul', 'South Korea', 'High', 0.8),
  globalPoint(-6.2088, 106.8456, 'Jakarta', 'Jakarta', 'Indonesia', 'High', 0.77),
  globalPoint(21.0285, 105.8542, 'Hanoi', 'Hanoi', 'Vietnam', 'Medium', 0.55),
  globalPoint(39.9042, 116.4074, 'Beijing', 'Beijing', 'China', 'High', 0.79),
  globalPoint(25.033, 121.5654, 'Taipei', 'Taipei', 'Taiwan', 'High', 0.71),

  // Oceania
  globalPoint(-33.8688, 151.2093, 'Sydney', 'Sydney', 'Australia', 'High', 0.84),
  globalPoint(-37.8136, 144.9631, 'Melbourne', 'Melbourne', 'Australia', 'High', 0.8),
  globalPoint(-31.9505, 115.8605, 'Perth', 'Perth', 'Australia', 'Medium', 0.58),
  globalPoint(-36.8485, 174.7633, 'Auckland', 'Auckland', 'New Zealand', 'Medium', 0.56),

  // Additional spread (secondary cities)
  globalPoint(59.9139, 10.7522, 'Oslo', 'Oslo', 'Norway', 'Low', 0.4),
  globalPoint(47.3769, 8.5417, 'Zurich', 'Zurich', 'Switzerland', 'High', 0.68),
  globalPoint(38.7223, -9.1393, 'Lisbon', 'Lisbon', 'Portugal', 'Medium', 0.53),
  globalPoint(64.1466, -21.9426, 'Reykjavik', 'Reykjavik', 'Iceland', 'Low', 0.32),
  globalPoint(-8.839, 13.2894, 'Luanda', 'Luanda', 'Angola', 'Medium', 0.5),
  globalPoint(3.848, 11.5021, 'Yaoundé', 'Yaoundé', 'Cameroon', 'Medium', 0.44),
  globalPoint(-3.745, 39.664, 'Dar es Salaam', 'Dar es Salaam', 'Tanzania', 'Medium', 0.51),
  globalPoint(9.0579, 7.4951, 'Abuja', 'Abuja', 'Nigeria', 'Medium', 0.54),
  globalPoint(32.7767, -96.797, 'Dallas', 'Dallas', 'United States', 'High', 0.72),
  globalPoint(29.7604, -95.3698, 'Houston', 'Houston', 'United States', 'High', 0.74),
  globalPoint(33.749, -84.388, 'Atlanta', 'Atlanta', 'United States', 'High', 0.7),
  globalPoint(47.6062, -122.3321, 'Seattle', 'Seattle', 'United States', 'Medium', 0.58),
  globalPoint(39.7392, -104.9903, 'Denver', 'Denver', 'United States', 'Medium', 0.52),
  globalPoint(20.6597, -103.3496, 'Guadalajara', 'Guadalajara', 'Mexico', 'Medium', 0.5),
  globalPoint(-22.9068, -43.1729, 'Rio de Janeiro', 'Rio de Janeiro', 'Brazil', 'High', 0.78),
  globalPoint(3.139, 101.6869, 'Kuala Lumpur', 'Kuala Lumpur', 'Malaysia', 'High', 0.75),
  globalPoint(23.8103, 90.4125, 'Dhaka', 'Dhaka', 'Bangladesh', 'High', 0.7),
  globalPoint(24.8607, 67.0011, 'Karachi', 'Karachi', 'Pakistan', 'High', 0.72),
  globalPoint(30.0444, 31.2357, 'Alexandria', 'Alexandria', 'Egypt', 'Medium', 0.55),
  globalPoint(43.2389, 76.8897, 'Almaty', 'Almaty', 'Kazakhstan', 'Medium', 0.48),
  globalPoint(55.9533, -3.1883, 'Edinburgh', 'Edinburgh', 'United Kingdom', 'Medium', 0.5),
  globalPoint(53.4808, -2.2426, 'Manchester', 'Manchester', 'United Kingdom', 'High', 0.68),
  globalPoint(48.1351, 11.582, 'Munich', 'Munich', 'Germany', 'High', 0.7),
  globalPoint(45.4642, 9.19, 'Milan', 'Milan', 'Italy', 'High', 0.73),
  globalPoint(50.1109, 8.6821, 'Frankfurt', 'Frankfurt', 'Germany', 'High', 0.74),
  globalPoint(-27.4698, 153.0251, 'Brisbane', 'Brisbane', 'Australia', 'Medium', 0.54),
  globalPoint(-34.9285, 138.6007, 'Adelaide', 'Adelaide', 'Australia', 'Medium', 0.48),
  globalPoint(35.1796, 129.0756, 'Busan', 'Busan', 'South Korea', 'Medium', 0.56),
  globalPoint(34.6937, 135.5023, 'Osaka', 'Osaka', 'Japan', 'High', 0.76),
  globalPoint(10.8231, 106.6297, 'Ho Chi Minh City', 'Ho Chi Minh City', 'Vietnam', 'High', 0.72),
  globalPoint(-15.7975, -47.8919, 'Brasília', 'Brasília', 'Brazil', 'Medium', 0.52),
  globalPoint(64.2008, -149.4937, 'Fairbanks', 'Fairbanks', 'United States', 'Low', 0.35),
  globalPoint(61.2181, -149.9003, 'Anchorage', 'Anchorage', 'United States', 'Low', 0.38),
  globalPoint(-54.8019, -68.303, 'Ushuaia', 'Ushuaia', 'Argentina', 'Low', 0.3),
  globalPoint(78.2232, 15.6267, 'Longyearbyen', 'Longyearbyen', 'Norway', 'Low', 0.28),
]

/** De-dupe by label+coords; Gauteng detailed points take precedence. */
export function getAllHeatmapPoints(): HeatmapPoint[] {
  const seen = new Set<string>()
  const out: HeatmapPoint[] = []

  for (const p of [...GAUTENG_HEATMAP_POINTS, ...WORLDWIDE_HEATMAP_POINTS]) {
    const key = `${p.label}|${p.lat.toFixed(2)}|${p.lng.toFixed(2)}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(p)
  }
  return out
}
