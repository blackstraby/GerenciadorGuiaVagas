import { ObjectId } from "mongodb";

export const safeObjectId = s => ObjectId.isValid(s) ? new ObjectId(s) : null;