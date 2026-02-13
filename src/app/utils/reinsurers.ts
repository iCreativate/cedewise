export interface Reinsurer {
  id: string;
  name: string;
  rating?: string;
  location?: string;
  registered?: boolean;
}

export const reinsurers: Reinsurer[] = [
  // Global Tier 1 Reinsurers
  { id: 'munich-re', name: 'Munich Re', rating: 'AA+', location: 'Germany', registered: true },
  { id: 'swiss-re', name: 'Swiss Re', rating: 'AA-', location: 'Switzerland', registered: true },
  { id: 'hannover-re', name: 'Hannover Re', rating: 'AA-', location: 'Germany', registered: false },
  { id: 'scor', name: 'SCOR', rating: 'AA-', location: 'France', registered: true },
  { id: 'lloyd', name: 'Lloyd\'s of London', rating: 'A+', location: 'United Kingdom', registered: false },
  { id: 'berkshire', name: 'Berkshire Hathaway', rating: 'AA+', location: 'United States', registered: false },
  { id: 'rga', name: 'Reinsurance Group of America', rating: 'AA-', location: 'United States', registered: false },
  { id: 'everest-re', name: 'Everest Re', rating: 'A+', location: 'Bermuda', registered: true },
  { id: 'gen-re', name: 'Gen Re', rating: 'AA+', location: 'United States', registered: false },
  { id: 'partner-re', name: 'Partner Re', rating: 'A+', location: 'Bermuda', registered: false },
  
  // African Reinsurers
  { id: 'africa-re', name: 'Africa Re', rating: 'A-', location: 'Nigeria', registered: true },
  { id: 'cica-re', name: 'CICA Re', rating: 'B+', location: 'Togo', registered: false },
  { id: 'zep-re', name: 'ZEP Re (PTA Reinsurance Company)', rating: 'B+', location: 'Kenya', registered: false },
  { id: 'continental-re', name: 'Continental Re', rating: 'B+', location: 'Nigeria', registered: true },
  { id: 'kenya-re', name: 'Kenya Re', rating: 'B', location: 'Kenya', registered: false },
  { id: 'waica-re', name: 'WAICA Reinsurance Corporation', rating: 'B', location: 'Sierra Leone', registered: false },
  { id: 'scr-re', name: 'Société Centrale de Réassurance (SCR)', rating: 'B++', location: 'Morocco', registered: false },
  { id: 'tunis-re', name: 'Tunis Re', rating: 'B+', location: 'Tunisia', registered: false },
  { id: 'aveni-re', name: 'Aveni Re', rating: 'B', location: 'Côte d\'Ivoire', registered: false },
  { id: 'ghana-re', name: 'Ghana Reinsurance Company', rating: 'B', location: 'Ghana', registered: false },
  { id: 'east-africa-re', name: 'East Africa Reinsurance Company', rating: 'B', location: 'Kenya', registered: false },
  { id: 'tan-re', name: 'Tanzania Reinsurance Company (Tan-Re)', rating: 'B', location: 'Tanzania', registered: false },
  { id: 'namibia-re', name: 'NamibRe', rating: 'B', location: 'Namibia', registered: false },
  { id: 'uganda-re', name: 'Uganda Reinsurance Company', rating: 'B-', location: 'Uganda', registered: false },
  { id: 'zimbabwe-re', name: 'ZimRe', rating: 'B-', location: 'Zimbabwe', registered: false },
  { id: 'sava-re-zim', name: 'Sava Re (Zimbabwe)', rating: 'B', location: 'Zimbabwe', registered: false },
  { id: 'sen-re', name: 'SEN-RE', rating: 'B', location: 'Senegal', registered: false },
  { id: 'egyptian-re', name: 'Egyptian Reinsurance Company', rating: 'B++', location: 'Egypt', registered: false },
  { id: 'naicom', name: 'National Insurance Commission of Nigeria', rating: 'B', location: 'Nigeria', registered: false },
  { id: 'cameroon-re', name: 'Cameroon Reinsurance Company', rating: 'B', location: 'Cameroon', registered: false },
  
  // Asian Reinsurers
  { id: 'china-re', name: 'China Re', rating: 'A', location: 'China', registered: true },
  { id: 'korean-re', name: 'Korean Re', rating: 'A', location: 'South Korea', registered: false },
  { id: 'gi-re', name: 'General Insurance Corporation of India (GIC Re)', rating: 'B++', location: 'India', registered: false },
  { id: 'toa-re', name: 'Toa Reinsurance Company', rating: 'A+', location: 'Japan', registered: false },
  { id: 'taiping-re', name: 'Taiping Reinsurance Co. Ltd', rating: 'A', location: 'China', registered: false },
  { id: 'samsung-re', name: 'Samsung Re', rating: 'A+', location: 'South Korea', registered: false },
  { id: 'malaysia-re', name: 'Malaysian Reinsurance Berhad', rating: 'A-', location: 'Malaysia', registered: false },
  { id: 'singapore-re', name: 'Singapore Reinsurance Corporation', rating: 'A-', location: 'Singapore', registered: false },
  { id: 'thai-re', name: 'Thai Reinsurance Public Company Limited', rating: 'B++', location: 'Thailand', registered: false },
  { id: 'indonesia-re', name: 'Indonesia Re', rating: 'B+', location: 'Indonesia', registered: false },
  
  // Middle Eastern Reinsurers
  { id: 'trust-re', name: 'Trust Re', rating: 'A-', location: 'Bahrain', registered: false },
  { id: 'saudi-re', name: 'Saudi Re', rating: 'A3', location: 'Saudi Arabia', registered: false },
  { id: 'oman-re', name: 'Oman Re', rating: 'B++', location: 'Oman', registered: false },
  { id: 'arab-re', name: 'Arab Reinsurance Company', rating: 'B+', location: 'Lebanon', registered: false },
  { id: 'arig', name: 'Arab Insurance Group (ARIG)', rating: 'B++', location: 'Bahrain', registered: false },
  { id: 'qatar-re', name: 'Qatar Re', rating: 'A', location: 'Qatar', registered: false },
  { id: 'kuwait-re', name: 'Kuwait Reinsurance Company', rating: 'A-', location: 'Kuwait', registered: false },
  { id: 'emirates-re', name: 'Emirates Re', rating: 'A-', location: 'United Arab Emirates', registered: false },
  
  // Latin American Reinsurers
  { id: 'irb-brasil-re', name: 'IRB Brasil Re', rating: 'B++', location: 'Brazil', registered: false },
  { id: 'mapfre-re', name: 'MAPFRE Re', rating: 'A', location: 'Spain/Latin America', registered: false },
  { id: 'austral-re', name: 'Austral Resseguradora', rating: 'B+', location: 'Brazil', registered: false },
  { id: 'patria-re', name: 'Patria Re', rating: 'A-', location: 'Mexico', registered: false },
  { id: 'chubb-tempest-re', name: 'Chubb Tempest Re', rating: 'A++', location: 'Global', registered: false },
  
  // European Reinsurers
  { id: 'sirius', name: 'Sirius International', rating: 'A-', location: 'Sweden', registered: false },
  { id: 'liberty-mutual-re', name: 'Liberty Mutual Re', rating: 'A', location: 'United States/Global', registered: false },
  { id: 'transatlantic', name: 'Transatlantic Re', rating: 'A+', location: 'United States', registered: false },
  { id: 'axis-re', name: 'AXIS Re', rating: 'A+', location: 'Bermuda', registered: false },
  { id: 'validus-re', name: 'Validus Re', rating: 'A', location: 'Bermuda', registered: false },
  { id: 'renaissance-re', name: 'Renaissance Re', rating: 'A+', location: 'Bermuda', registered: false },
  { id: 'odyssey-re', name: 'Odyssey Re', rating: 'A', location: 'United States', registered: false },
  { id: 'convex-re', name: 'Convex Re', rating: 'A-', location: 'Bermuda/UK', registered: false },
  { id: 'r-v-re', name: 'R+V Re', rating: 'AA-', location: 'Germany', registered: false },
  { id: 'devk-re', name: 'DEVK Re', rating: 'A+', location: 'Germany', registered: false },
  { id: 'polish-re', name: 'Polish Re', rating: 'A-', location: 'Poland', registered: false },
  { id: 'vig-re', name: 'VIG Re', rating: 'A+', location: 'Czech Republic', registered: false },
  { id: 'sava-re', name: 'Sava Re', rating: 'A', location: 'Slovenia', registered: false },
  { id: 'russian-re', name: 'Russian Reinsurance Company', rating: 'B++', location: 'Russia', registered: false },
  { id: 'ingosstrakh', name: 'Ingosstrakh Re', rating: 'B++', location: 'Russia', registered: false },
  
  // Bermuda Market
  { id: 'arch-re', name: 'Arch Re', rating: 'A+', location: 'Bermuda', registered: false },
  { id: 'aspen-re', name: 'Aspen Re', rating: 'A', location: 'Bermuda', registered: false },
  { id: 'awac', name: 'Allied World Assurance Company', rating: 'A', location: 'Bermuda', registered: false },
  { id: 'hamilton-re', name: 'Hamilton Re', rating: 'A-', location: 'Bermuda', registered: false },
  { id: 'hiscox-re', name: 'Hiscox Re', rating: 'A', location: 'Bermuda', registered: false },
  { id: 'lancashire-re', name: 'Lancashire Re', rating: 'A-', location: 'Bermuda', registered: false },
  { id: 'ariel-re', name: 'Ariel Re', rating: 'A-', location: 'Bermuda', registered: false },
  
  // Lloyd's Syndicates with Reinsurance Focus
  { id: 'beazley', name: 'Beazley (Lloyd\'s)', rating: 'A', location: 'United Kingdom', registered: false },
  { id: 'chaucer', name: 'Chaucer (Lloyd\'s)', rating: 'A', location: 'United Kingdom', registered: false },
  { id: 'canopius', name: 'Canopius (Lloyd\'s)', rating: 'A', location: 'United Kingdom', registered: false },
  { id: 'tokio-marine-kiln', name: 'Tokio Marine Kiln (Lloyd\'s)', rating: 'A+', location: 'United Kingdom', registered: false },
  { id: 'brit', name: 'Brit (Lloyd\'s)', rating: 'A', location: 'United Kingdom', registered: false },
  
  // Additional Regional Reinsurers
  { id: 'peak-re', name: 'Peak Re', rating: 'A-', location: 'Hong Kong', registered: false },
  { id: 'nacora', name: 'Nacora Insurance Brokers', rating: 'A-', location: 'Switzerland', registered: false },
  { id: 'echo-re', name: 'Echo Re', rating: 'A-', location: 'Switzerland', registered: false },
  { id: 'helvetia', name: 'Helvetia Re', rating: 'A', location: 'Switzerland', registered: false },
  { id: 'new-india', name: 'New India Assurance', rating: 'B++', location: 'India', registered: false },
  { id: 'national-insurance', name: 'National Insurance Company Limited', rating: 'B+', location: 'India', registered: false },
  { id: 'sompo', name: 'Sompo International Re', rating: 'A+', location: 'Japan/Bermuda', registered: false },
  { id: 'allianz-re', name: 'Allianz Re', rating: 'AA', location: 'Germany', registered: false },
  { id: 'zurich-re', name: 'Zurich Re', rating: 'AA-', location: 'Switzerland', registered: false },
  { id: 'axa-xl-re', name: 'AXA XL Re', rating: 'AA-', location: 'Bermuda/Europe', registered: false }
]; 