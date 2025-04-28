export type Rating = {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  clerk_user_id: string;
};

export type Recommendation = {
  id: number;
  created_at: string;
  user_1_clerk_id: string;
  user_1_username: string;
  user_1_pfp: string;
  user_2_clerk_id: string;
  user_2_username: string;
  user_2_pfp: string;
};

export type Song = {
  created_at: string;
  id: number;
  is_rated: boolean;
  recommendation_id: number;
  sender_clerk_user_id: string;
  song_author: string;
  song_cover: string;
  song_name: string;
  spotify_url: string;
};

export type SupaSongData =
  | {
      id: number;
      created_at: string;
      song_name: string;
      song_author: string;
      song_cover: string;
      spotify_url: string;
      sender_clerk_user_id: string;
      recommendation_id: number;
      is_rated: boolean;
      Ratings: {
        id: number;
        clerk_user_id: string;
        rating: number;
        comment: string;
        created_at: string;
      }[];
    }[]
  | null;
