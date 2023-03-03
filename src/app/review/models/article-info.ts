import { User } from "./user";

export interface ArticleInfo
{
    id: number;
    title: string;
    details: string;
    price: number;
    user: User;
    comments: Comment[];
}