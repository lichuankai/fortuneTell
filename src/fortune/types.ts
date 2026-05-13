export type Gender = "" | "男" | "女";

export type BirthFormState = {
  birthDate: string;
  birthTime: string;
  gender: Gender;
  calendar: string;
  birthPlace: string;
  question: string;
};
