import { CategoryState } from "src/app/articles-overeview/models/category-state";
import { Attribute } from "src/app/share/models/attribute";
import { Category } from "src/app/share/models/category";

export interface DialogData{
    categoryName:string|undefined;
    accepted:boolean;
    attributes: CategoryState[]
}