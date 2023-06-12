import { CategoryState } from "src/app/articles-overeview/models/category-state";
import { Attribute } from "src/app/share/models/attribute";

export interface DialogReult
{
    attributes: CategoryState[]
    accepted:boolean;
}