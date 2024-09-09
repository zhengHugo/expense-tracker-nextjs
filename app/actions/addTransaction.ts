"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Effect, pipe } from "effect";

type TransactionData = {
  text: string;
  amount: bigint;
};

type TransactionRecord = TransactionData & { userId: string };

export type TransactionResult =
  | { type: "success"; data: TransactionData }
  | { type: "error"; error: string };

async function addTransaction(formData: FormData): Promise<TransactionResult> {
  const validateUser = () => {
    const { userId } = auth();
    // get logged in user
    // check user
    if (!userId) {
      return Effect.fail("User not found");
    } else {
      return Effect.succeed(userId);
    }
  };

  const validateTextValue = (textValue: string) => {
    if (!textValue || textValue === "") {
      return Effect.fail("Text value is required");
    } else {
      return Effect.succeed(textValue);
    }
  };

  const validateAmount = (amount: string) => {
    if (!amount) {
      return Effect.fail("Amount is required");
    }
    const parsedAmount = parseFloat(amount);
    return isNaN(parsedAmount)
      ? Effect.fail("Amount is required")
      : Effect.succeed(BigInt(parsedAmount * 100));
  };

  const validateForm = (formData: FormData) =>
    pipe(
      Effect.all({
        userId: validateUser(),
        text: validateTextValue(formData.get("text") as string),
        amount: validateAmount(formData.get("amount") as string),
      }),
    );

  const createTransaction = (transactionRecord: TransactionRecord) =>
    Effect.tryPromise({
      try: () =>
        db.transaction.create({
          data: transactionRecord,
        }),
      catch: () => "Create Transaction failed.",
    });

  const program = pipe(
    validateForm(formData),
    Effect.flatMap(createTransaction),
    Effect.tap(() => revalidatePath("/")),
    Effect.match({
      onSuccess: (value) => {
        return {
          type: "success" as const,
          data: { text: value.text, amount: value.amount },
        };
      },
      onFailure: (error) => {
        return {
          type: "error" as const,
          error: error,
        };
      },
    }),
  );
  return await Effect.runPromise(program);
}

export default addTransaction;
