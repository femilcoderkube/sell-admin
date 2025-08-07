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
export interface AdminType {
  _id: string;
  userName: string;
  role: string;
  email: string;
  password: string;
  phoneNumber: string;
  isActive: boolean;
  ipAddress: string;
  deviceType: string;
  adminAccess: string;
  lastLoginDate: string;
}
export interface AdminState {
  admins: AdminType[];
  dashboard: any;
  role: any;
  loading: boolean;
  error: string | null;
  currentPage: number;
  perPage: number;
  totalCount: number;
  searchTerm: string;
  adminDetail: AdminType | null;
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
  websiteUrl?: string;
  description?: string;
  logo?: string;
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

export interface League {
  _id?: string;
  device: any;
  game: any;
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
  operatorDetail: any | null;
  operators: any;
  operatorsLoading: any;
  operatorsError: any;
  operatorsCurrentPage: any;
  operatorsPerPage: any;
  operatorsTotalCount: any;
  matcheDetail: null;
  participants: any[];
  participantsLoading: boolean;
  participantsError: string | null;
  participantsCurrentPage: any;
  participantsPerPage: any;
  participantsTotalCount: any;
  matches: any[];
  matchesLoading: boolean;
  matchesError: string | null;
  matchesTotalCount: any;
  matchesCurrentPage: any;
  matchesPerPage: any;
  tickets: any[];
  ticketsLoading: boolean;
  ticketsError: string | null;
  ticketsTotalCount: any;
  ticketsCurrentPage: any;
  ticketsPerPage: any;
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

export interface BadgeType {
  _id: string;
  name: string;
  descriptionEN: string;
  descriptionAR: string;
  logo: string;
}

export interface BadgeState {
  badges: BadgeType[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  perPage: number;
  totalCount: number;
  searchTerm: string;
  badgeDetail: BadgeType | null;
  badgeNames: BadgeNameType[];
}

export interface TrophieType {
  _id: string;
  BadgeID: any;
  position: number;
  points: number;
  prize: string;
}

export interface TrophiesState {
  trophies: TrophieType[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  perPage: number;
  totalCount: number;
  searchTerm: string;
  trophyDetail: TrophieType | null;
}

export interface BadgeNameType {
  _id: string;
  name: string;
}

// User type based on provided model
export interface User {
  _id: string;
  ipAddress: string;
  username: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  nationality: string;
  role: string;
  profilePicture: string;
  favoriteGame: string;
  socialMediaHandles: Record<string, any>;
  deviceType: string;
  isBanned: boolean;
  lastLoginDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalItem: number;
  searchTerm: string;
  userDetail: User | null;
  bannedUsers: User[];
}

export interface AssignLeaguePayload {
  operatorIds: string[];
  leagueId: string;
}
export interface Tournament {
  id?: string;
  title: string;
  titleAr: string;
  partner: string;
  game: string;
  platform: string;
  tournamentType: string;
  minPlayersPerTeam?: number;
  maxPlayersPerTeam?: number;
  maxParticipants: number;
  description: string;
  descriptionAr: string;
  prizepool: number;
  rules: string;
  isActive: boolean;
  isHidden?: boolean;
  customRegistrationFields: Array<{
    fieldName: string;
    fieldType: string;
    required: boolean;
  }>;
  timeLine: Array<{
    title: string;
    titleAr: string;
    startDate: string;
    endDate: string;
  }>;
  logo: string;
  internalPhoto: string;
  headerPhoto: string;
  startDate: string;
  endDate: string;
  messages: string[];
  randomMessages: Array<{
    randomText: string;
    tags: string[];
  }>;
}

export interface TournamentState {
  tournaments: Tournament[];
  loading: boolean;
  totalCounts: any;
  error: string | null;
  currentPage: number;
  perPage: number;
  totalCount: number;
  searchTerm: string;
  tournamentDetail: Tournament | null;
  operatorDetail: any | null;
  operators: any[];
  operatorsLoading: boolean;
  operatorsError: string | null;
  operatorsCurrentPage: number;
  operatorsPerPage: number;
  operatorsTotalCount: number;
  matcheDetail: any | null;
  participants: any[];
  participantsLoading: boolean;
  participantsError: string | null;
  participantsCurrentPage: number;
  participantsPerPage: number;
  participantsTotalCount: number;
  matches: any[];
  matchesLoading: boolean;
  matchesError: string | null;
  matchesCurrentPage: number;
  matchesPerPage: number;
  matchesTotalCount: number;
  tickets: any[];
  ticketsLoading: boolean;
  ticketsError: string | null;
  ticketsTotalCount: number;
  ticketsCurrentPage: number;
  ticketsPerPage: number;
  bulkJoinLoading?: boolean;
  bulkJoinError?: string | null;
  eligibleParticipants: any[]; // Adjust type based on API response (e.g., { team: string }[])
  eligibleParticipantsLoading: boolean;
  eligibleParticipantsError: string | null;
  eligibleParticipantsCurrentPage: number;
  eligibleParticipantsPerPage: number;
  eligibleParticipantsTotalCount: number;
  eligibleParticipantsSearchTerm: string;
  createMatchesLoading: boolean;
  createMatchesError: string | null;
  roundsLoading: boolean;
  roundsError: null;
  singleMatch: undefined;
}

export interface AssignTournamentPayload {
  operatorIds: string[];
  tournamentId: string;
}
export interface Match {
  _id: string;
  tournament: string;
  stageRoundId: {
    _id: string;
    stageId: string;
    roundName: string;
    config: any;
    createdAt: string;
    updatedAt: string;
  };
  stageId: string;
  opponent1: {
    _id: string;
    tournament: string;
    team: {
      _id: string;
      teamName: string;
      teamShortName: string;
      region: string;
      logoImage: string;
      backgroundImage: string;
      createdAt: string;
      updatedAt: string;
    };
    participants: string[];
    createdAt: string;
    updatedAt: string;
  } | null;
  opponent2: {
    _id: string;
    tournament: string;
    team: {
      _id: string;
      teamName: string;
      teamShortName: string;
      region: string;
      logoImage: string;
      backgroundImage: string;
      createdAt: string;
      updatedAt: string;
    };
    participants: string[];
    createdAt: string;
    updatedAt: string;
  } | null;
  winner: string | null;
  isScoreVerified: boolean;
  status: string;
  isDeleted: boolean;
  startTime: string | null;
  endTime: string | null;
  config: any;
  createdAt: string;
  updatedAt: string;
  matchScores: any[];
}
export interface DraftingPhaseState {
  data: any; // Replace with specific type based on API response
  loading: boolean;
  error: string | null;
}

export interface EligiblePlayer {
  id: string;
  // Add other player properties based on API response
  name?: string;
  status?: string;
}

export interface EligiblePlayersState {
  eligiblePlayers: EligiblePlayer[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  perPage: number;
  totalPages: number;
  totalItem: number;
  searchTerm: string;
}

export interface Participant {
  id: string;
  name: string;
  shortName: string;
  region: string;
  logoImage: string;
  backgroundImage: string;
  participantId: string
}

export interface Group {
  _id: string;
  tournament: string;
  stage: string;
  seed: {
    _id: string;
    tournament: string;
    team: {
      _id: string;
      teamName: string;
      teamShortName: string;
      region: string;
      members: { user: string; role: string; _id: string; joinedAt: string }[];
      createdAt: string;
      updatedAt: string;
      backgroundImage: string;
      logoImage: string;
    };
    participants: string[];
    createdAt: string;
    updatedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}
