import { Attribute } from "src/app/share/models/attribute";
import { Category } from "src/app/share/models/category";

export interface DialogData{
    categoryId:number
    existingAttributes: Attribute[]
}