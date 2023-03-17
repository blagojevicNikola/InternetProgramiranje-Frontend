import { Attributes } from "./attributes";
import { User } from "./user";

export interface ArticleInfo
{
    id: number;
    title: string;
    details: string;
    price: number;
    date:Date;
    user: User;
    comments: Comment[];
    attributes:Attributes[];
}