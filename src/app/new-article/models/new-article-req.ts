import { Attribute } from "src/app/share/models/attribute";

export interface NewArticleReq
{
    title: string;
    price: number;
    details: string;
    new: boolean;
    category:number;
    attributes: Attribute[]
}