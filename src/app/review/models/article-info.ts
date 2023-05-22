import { Attributes } from "./attributes";
import { Comment } from "./comment";
import { Photo } from "./photo";
import { User } from "./user";

export interface ArticleInfo
{
    id: number;
    title: string;
    details: string;
    price: number;
    date:Date;
    articleTypeId:number;
    articleTypeName:string;
    isNew:boolean;
    user: User;
    comments: Comment[];
    attributes:Attributes[];
    photos:Photo[];
}