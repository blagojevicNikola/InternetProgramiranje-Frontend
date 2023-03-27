import { Attribute } from "src/app/share/models/attribute";

export interface DialogResult
{
    attributes: Attribute[]
    accepted:boolean;
}