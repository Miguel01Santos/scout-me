import { Post } from '../posts/type';
import { ProfileCard } from '../profiles/type';
import { RatingItem } from '../ratings/type';

export interface FeedPostItem {
  type: 'post';
  id: string;
  createdAt: string;
  author: ProfileCard;
  post: Post;
}

export interface FeedRatingItem {
  type: 'rating';
  id: string;
  createdAt: string;
  rating: RatingItem;
}

export type FeedItem = FeedPostItem | FeedRatingItem;

export interface FeedPage {
  items: FeedItem[];
  nextCursor: string | null;
}
