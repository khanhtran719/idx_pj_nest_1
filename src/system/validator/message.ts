export const message = {
  string: (field: string) => `${field} phải là chuỗi.`,

  required: (field: string) => `${field} không được để trống.`,

  invalid: (field: string) => `${field} không hợp lệ.`,

  number: (field: string) => `${field} phải là số.`,

  min: {
    number: (field: string, min: number) =>
      `${field} phải bé hơn hoặc bằng ${min}`,
  },

  max: {
    number: (field: string, max: number) =>
      `${field} must be less than or equal to ${max}`,
  },
};
