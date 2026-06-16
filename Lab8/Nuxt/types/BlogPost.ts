import type { User } from "./user";
import type { Category } from "./category";

export interface BlogPost {
  id: number
  title: string
  published_at: string | null
  user?: User
  category?: Category
  [key: string]: any
}
