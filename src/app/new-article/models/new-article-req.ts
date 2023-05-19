import { Attribute } from "src/app/share/models/attribute";

export interface NewArticleReq
{
    title: string;
    price: number;
    details: string;
    isNew: boolean;
    categoryId:number;
    attributes: Attribute[]
}