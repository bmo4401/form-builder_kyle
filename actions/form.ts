"use server";
import prisma from "@/libs/prisma";
import { revalidatePath } from "next/cache";

export const getForms = () => {
  try {
    return prisma.form.findMany();
  } catch (error) {
    throw new Error("some thing went wrong");
  }
};

export const createForm = async (input: string) => {
  try {
    const res = await prisma.form.create({ data: { name: input } });
    revalidatePath("/");
    return res;
  } catch (error) {
    throw new Error("some thing went wrong");
  }
};
export const getSummaryForms = async () => {
  try {
    const res = await prisma.form.aggregate({
      _sum: {
        views: true,
        submissions: true,
      },
      _count: {
        id: true,
      },
    });
    const views = res._sum.views;
    const totalSubmit = res._sum.submissions ?? 0;
    const rateSubmit = ((views ? totalSubmit / views : 0) * 100).toFixed(2);
    const totalForm = res._count.id;
    return {
      views,
      totalForm,
      rateSubmit,
      totalSubmit,
    };
  } catch (error) {
    throw new Error("some thing went wrong");
  }
};
