export enum CategoryEnum {
  FOOD = "FOOD",
  TRANSPORT = "TRANSPORT",
  SHOPPING = "SHOPPING",
  ENTERTAINMENT = "ENTERTAINMENT",
  EDUCATION = "EDUCATION",
  HEALTH = "HEALTH",
  SALARY = "SALARY",
  INVESTMENT = "INVESTMENT",
  OTHER = "OTHER",
}

export const CategoryMap = new Map<string, string>([
  ["FOOD", "飲食"],
  ["TRANSPORT", "交通"],
  ["SHOPPING", "購物"],
  ["ENTERTAINMENT", "娛樂"],
  ["EDUCATION", "教育"],
  ["HEALTH", "醫療"],
  ["SALARY", "薪資"],
  ["INVESTMENT", "投資"],
  ["OTHER", "其他"],
]);
