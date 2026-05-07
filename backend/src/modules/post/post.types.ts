export interface CreatePostInput {
  title: string;
  content: string;
  thumbnailImage?: string;
  mainImage?: string;
  tags?: string[];
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  thumbnailImage?: string;
  mainImage?: string;
  tags?: string[];
}
