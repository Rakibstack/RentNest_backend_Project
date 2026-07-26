import { prisma } from "../../lib/prisma";

const getAllCategory = async () => {
  const category = await prisma.category.findMany({
    select: {
      id: true,
      title: true,
    },
  });
  return category;
};

export const categoryService = {
  getAllCategory,
};
