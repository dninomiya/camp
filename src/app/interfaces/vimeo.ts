export interface VimeoPostResponse {
  uri: string;
  name: string;
  description?: null;
  type: string;
  link: string;
  duration: number;
  width: number;
  language?: null;
  height: number;
  embed: Embed;
  created_time: string;
  modified_time: string;
  release_time: string;
  content_rating?: string[] | null;
  license?: null;
  privacy: Privacy;
  pictures: Pictures;
  tags?: null[] | null;
  stats: Stats;
  categories?: null[] | null;
  metadata: Metadata;
  user: User;
  review_page: ReviewPage;
  parent_folder?: null;
  last_user_action_event_date: string;
  app: App;
  status: string;
  resource_key: string;
  upload: Upload;
  transcode: Transcode;
}

interface Embed {
  buttons: Buttons;
  logos: Logos;
  title: Title;
  playbar: boolean;
  volume: boolean;
  speed: boolean;
  color: string;
  uri: string;
  html: string;
  badges: Badges;
}
interface Buttons {
  like: boolean;
  watchlater: boolean;
  share: boolean;
  embed: boolean;
  hd: boolean;
  fullscreen: boolean;
  scaling: boolean;
}
interface Logos {
  vimeo: boolean;
  custom: Custom;
}
interface Custom {
  active: boolean;
  link?: null;
  sticky: boolean;
}
interface Title {
  name: string;
  owner: string;
  portrait: string;
}
interface Badges {
  hdr: boolean;
  live: Live;
  staff_pick: StaffPick;
  vod: boolean;
  weekend_challenge: boolean;
}
interface Live {
  streaming: boolean;
  archived: boolean;
}
interface StaffPick {
  normal: boolean;
  best_of_the_month: boolean;
  best_of_the_year: boolean;
  premiere: boolean;
}
interface Privacy {
  view: string;
  embed: string;
  download: boolean;
  add: boolean;
  comments: string;
}
interface Pictures {
  uri?: null;
  active: boolean;
  type: string;
  sizes?: SizesEntity[] | null;
  resource_key: string;
}
interface SizesEntity {
  width: number;
  height: number;
  link: string;
  link_with_play_button: string;
}
interface Stats {
  plays: number;
}
interface Metadata {
  connections: Connections;
  interactions: Interactions;
}
interface Connections {
  comments: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  credits: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  likes: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  pictures: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  texttracks: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  related?: null;
  recommendations: RecommendationsOrFeedOrMembership;
  albums: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  available_albums: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  versions: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
}
interface CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock {
  uri: string;
  options?: string[] | null;
  total: number;
}
interface RecommendationsOrFeedOrMembership {
  uri: string;
  options?: string[] | null;
}
interface Interactions {
  watchlater: Watchlater;
  report: Report;
}
interface Watchlater {
  uri: string;
  options?: string[] | null;
  added: boolean;
  added_time?: null;
}
interface Report {
  uri: string;
  options?: string[] | null;
  reason?: string[] | null;
}
interface User {
  uri: string;
  name: string;
  link: string;
  location: string;
  bio?: null;
  short_bio?: null;
  created_time: string;
  pictures: Pictures1;
  websites?: WebsitesEntity[] | null;
  metadata: Metadata1;
  preferences: Preferences;
  content_filter?: string[] | null;
  upload_quota: UploadQuota;
  resource_key: string;
  account: string;
}
interface Pictures1 {
  uri: string;
  active: boolean;
  type: string;
  sizes?: SizesEntity1[] | null;
  resource_key: string;
}
interface SizesEntity1 {
  width: number;
  height: number;
  link: string;
}
interface WebsitesEntity {
  name: string;
  link: string;
  description?: null;
}
interface Metadata1 {
  connections: Connections1;
}
interface Connections1 {
  albums: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  appearances: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  categories: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  channels: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  feed: RecommendationsOrFeedOrMembership;
  followers: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  following: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  groups: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  likes: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  membership: RecommendationsOrFeedOrMembership;
  moderated_channels: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  portfolios: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  videos: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  watchlater: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  shared: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  pictures: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  watched_videos: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  folders: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
  block: CommentsOrCreditsOrLikesOrPicturesOrTexttracksOrAlbumsOrAvailableAlbumsOrVersionsOrAppearancesOrCategoriesOrChannelsOrFollowersOrFollowingOrGroupsOrModeratedChannelsOrPortfoliosOrVideosOrWatchlaterOrSharedOrWatchedVideosOrFoldersOrBlock;
}
interface Preferences {
  videos: Videos;
}
interface Videos {
  privacy: Privacy;
}
interface UploadQuota {
  space: Space;
  periodic: Periodic;
  lifetime: Lifetime;
}
interface Space {
  free: number;
  max: number;
  used: number;
  showing: string;
}
interface Periodic {
  free: number;
  max: number;
  used: number;
  reset_date: string;
}
interface Lifetime {
  free?: null;
  max?: null;
  used?: null;
}
interface ReviewPage {
  active: boolean;
  link: string;
}
interface App {
  name: string;
  uri: string;
}
interface Upload {
  status: string;
  upload_link: string;
  form?: null;
  complete_uri?: null;
  approach: string;
  size: number;
  redirect_url?: null;
  link?: null;
}
interface Transcode {
  status: string;
}

export interface VimeoUser {
  uploadQuota: UploadQuota;
}
