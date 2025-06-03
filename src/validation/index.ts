import * as Yup from "yup";

export const deviceSchema = Yup.object().shape({
  name: Yup.string().required("Device name is required"),
  logo: Yup.mixed<any>().required("Logo is required"),
});

export const gameSchema = Yup.object().shape({
  name: Yup.string().required("Game name is required"),
  shortName: Yup.string().required("Short name is required"),
  logo: Yup.mixed<any>().required("Logo is required"),
  color: Yup.string().required("Color is required"),
});

export const addPartnerSchema = Yup.object().shape({
  nameEn: Yup.string().required("The name field is required"),
  nameAr: Yup.string().notRequired(),
  partnerUrl: Yup.string().notRequired(),
  shortName: Yup.string().required("The short name field is required"),
  description: Yup.string().notRequired(),
  partnerPic: Yup.mixed<any>().required("This field is required"),
  backgroundImage: Yup.mixed<any>().required("This field is required"),
  prizePool: Yup.string().required("The prize pool field is required"),
  order: Yup.string().required("The order field is required"),
  partnerNews: Yup.array()
    .of(
      Yup.object().shape({
        image: Yup.mixed<any>().required("Image URL is required"),
        url: Yup.string().url("Invalid URL").required("URL is required"),
      })
    )
    .notRequired(),

  partnerSponsors: Yup.array()
    .of(
      Yup.object().shape({
        image: Yup.mixed<any>().required("Image URL is required"),
        url: Yup.string().url("Invalid URL").required("URL is required"),
      })
    )
    .notRequired(),
  websiteUrl: Yup.string().url("Invalid Website URL").notRequired(),
  facebookUrl: Yup.string().url("Invalid Facebook URL").notRequired(),
  twitterUrl: Yup.string().url("Invalid Twitter URL").notRequired(),
  youtubeUrl: Yup.string().url("Invalid YouTube URL").notRequired(),
  twitchUrl: Yup.string().url("Invalid Twitch URL").notRequired(),
  instagramUrl: Yup.string().url("Invalid Instagram URL").notRequired(),
  discordUrl: Yup.string().url("Invalid Discord URL").notRequired(),
});
export const addRuleSchema = Yup.object().shape({
  nameEn: Yup.string().required("The Title field is required"),
  nameAr: Yup.string().notRequired(),
});
export const addBadgeSchema = Yup.object().shape({
  name: Yup.string().required("The Name field is required"),
  descriptionEN: Yup.string().required("The Description field is required"),
  descriptionAR: Yup.string().notRequired(),
  logo: Yup.mixed<any>().required("Logo is required"),
});

export const leagueValidationSchema = Yup.object().shape({
  nameEn: Yup.string().required("League name in English is required"),
  nameAr: Yup.string().optional(),
  game: Yup.string().required("Game is required"),
  device: Yup.string().required("Device is required"),
  isSolo: Yup.boolean().required(),
  totalPlayers: Yup.number().when("isEndlessPlayers", {
    is: false,
    then: Yup.number()
      .min(2, "At least 2 participants are required")
      .required("Number of participants is required"),
    otherwise: Yup.number().nullable(),
  }),
  minPlayersPerTeam: Yup.number().when("isSolo", {
    is: false,
    then: Yup.number()
      .min(2, "Minimum 2 players per team")
      .required("Minimum players per team is required"),
  }),
  maxPlayersPerTeam: Yup.number().when("isSolo", {
    is: false,
    then: Yup.number()
      .min(Yup.ref("minPlayersPerTeam"), "Must be at least min players")
      .required("Maximum players per team is required"),
  }),
  isEndlessPlayers: Yup.boolean().required(),
  endDate: Yup.string().required("Ending date is required"),
  partner: Yup.string().required("Partner is required"),
  about: Yup.string().required("About the league is required"),
  tags: Yup.array().of(Yup.string()).min(1, "At least one tag is required"),
  isFeatured: Yup.boolean().required(),
  leagueBannerLink: Yup.string().when("isFeatured", {
    is: true,
    then: Yup.string()
      .url("Must be a valid URL")
      .required("Banner link is required"),
  }),
  hydraulicsImage: Yup.mixed().required("Card image is required"),
  mobileHeader: Yup.mixed().required("Header image is required"),
  bannerImage: Yup.mixed().required("Logo image is required"),
  prizePool: Yup.number()
    .min(0, "Prize pool cannot be negative")
    .required("Prize pool is required"),
  rules: Yup.array()
    .of(
      Yup.object().shape({
        id: Yup.string().optional(),
        titleEn: Yup.string().required("Rule title in English is required"),
        titleAr: Yup.string().optional(),
        descriptionEn: Yup.string().required(
          "Rule description in English is required"
        ),
        descriptionAr: Yup.string().optional(),
      })
    )
    .min(1, "At least one rule is required"),
  positions: Yup.array()
    .of(
      Yup.object().shape({
        badgeId: Yup.string().required("Badge is required"),
        position: Yup.number().min(1, "Position must be at least 1").required(),
        points: Yup.number()
          .min(0, "Points cannot be negative")
          .required("Points are required"),
        prize: Yup.string().required("Prize is required"),
      })
    )
    .min(1, "At least one winner is required"),
  waitingList: Yup.boolean().required(),
  verifiedAccounts: Yup.boolean().required(),
  startDate: Yup.string().optional(),
});
