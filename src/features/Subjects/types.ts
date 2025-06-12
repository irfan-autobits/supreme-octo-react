// project/src/features/Subjects/types.ts

export type ImageObj = { id: string; url: string };

export interface Subject {
  id: string; // uuid
  images: ImageObj[];
  subject_name: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  aadhar: string;
  added_date: string;
}

export interface SearchParams {
  query: string;
  personFilter: string;
}

// export interface Subject {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   age: number;
//   gender: string;
//   images: string[];
// }