import { ObjectId } from "mongodb";

export interface ElementRange {
  min: number;
  max: number;
  target: number;
}

export interface AlloyConfig {
  _id?: ObjectId | string;
  id: string;
  name: string;
  category: string;
  elements: {
    [key: string]: ElementRange;
  };
  applications: string[];
  status: "active" | "inactive" | "deprecated";
  userId?: string; // Clerk user ID
  createdAt?: Date;
  updatedAt?: Date;
}
