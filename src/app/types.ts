// auth
export interface AuthState {
  user: {
    _id: string;
    email: string | null;
    isSuperAdmin: boolean;
  };
  token: string | null;
  loading: boolean;
  error: string | null;
  admin: any;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    _id: string;
    email: string;
    token: string;
    isSuperAdmin: boolean;
    admin: any;
  };
}

// partners
export interface PartnerType {
  _id: string;
  nameEn: string;
  nameAr: string;
  shortName: string;
  partnerPic: string;
  backgroundImage: string;
  status: boolean;
  partnerUrl?: string;
  websiteUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  youtubeUrl?: string;
  twitchUrl?: string;
  instagramUrl?: string;
  discordUrl?: string;
  description?: string;
  prizePool?: number;
  order?: number;
  partnerNews?: { image: any; url: string }[];
  partnerSponsors?: { image: any; url: string }[];
}

export interface PartnersState {
  partners: PartnerType[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  perPage: number;
  totalCount: number;
  searchTerm: string;
  partnerDetail: PartnerType | null;
}

// devices
export interface DeviceType {
  _id: string;
  name: string;
  logo: string;
}

export interface DevicesState {
  devices: DeviceType[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  perPage: number;
  totalCount: number;
  searchTerm: string;
}

// games
export interface GameType {
  _id: string;
  name: string;
  shortName: string;
  logo: string;
  gameId: string;
  color: any;
}

export interface GamesState {
  games: GameType[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  perPage: number;
  totalCount: number;
  searchTerm: string;
}

// gameIds

export interface GameIdType {
  _id: string;
  name: string;
}

export interface GameIdsState {
  gameIds: GameIdType[];
  loading: boolean;
  error: string | null;
}

export interface League {
  _id?: string;
  device: string;
  game: string;
  partner: string;
  name: string;
  about: string;
  tags: string[];
  isSolo: boolean;
  totalPlayers: number;
  minPlayersPerTeam?: number;
  maxPlayersPerTeam?: number;
  prizePool: number;
  positions: Array<{
    BadgeID: string;
    position: number;
    points: number;
    prize: string;
  }>;
  isEndlessPlayers: boolean;
  isFeatured: boolean;
  hydraulicsImage?: string;
  mobileHeader?: string;
  bannerImage?: string;
  leagueBannerLink: string;
  endDate: string;
  rules: string[];
  startDate?: string;
  existingPositionIds?: string[];
}

export interface LeagueState {
  leagues: League[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  perPage: number;
  totalCount: number;
  searchTerm: string;
  leagueDetail: League | null;
}
export interface Rule {
  id?: string; // For existing rules from the database
  titleEn: string;
  titleAr?: string;
  descriptionEn: string;
  descriptionAr?: string;
}
export interface Winner {
  badgeId: string;
  position: number;
  points: number;
  prize: string;
}
