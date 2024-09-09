"use client";

import React from "react";
import addTransaction, {
  TransactionResult,
} from "@/app/actions/addTransaction";
import { Effect, Match, pipe } from "effect";
import { toast } from "react-toastify";

const AddTransaction = () => {
  const matchTransactionResult = Match.type<TransactionResult>().pipe(
    Match.when({ type: "success" }, ({ data }) => {
      return Effect.succeed(data);
    }),
    Match.when({ type: "error" }, ({ error }) => {
      return Effect.fail(error);
    }),
    Match.exhaustive,
  );
  const clientAction = (formData: FormData) =>
    pipe(
      Effect.promise(() => addTransaction(formData)),
      Effect.tap(console.log),
      Effect.flatMap(matchTransactionResult),
      Effect.matchEffect({
        onFailure: (err) =>
          pipe(
            Effect.sync(() => toast.error(err)),
            Effect.map(() => `Error handled: ${err}`),
          ),
        onSuccess: (data) =>
          pipe(
            Effect.sync(() => toast.success("Transaction added successfully.")),
            Effect.map(() => `Successfully processed data: ${data}`),
          ),
      }),
    );
  return (
    <>
      <h3>Add transaction</h3>
      <form
        action={(formData) =>
          Effect.runPromise(clientAction(formData)).then(console.log)
        }
      >
        <div className="form-control">
          <label htmlFor="text">Text</label>
          <input
            type="text"
            name="text"
            id="text"
            placeholder="Enter text here"
          />
        </div>
        <div className="form-control">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            name="amount"
            id="amount"
            placeholder="Enter amount"
            step="0.01"
          />
        </div>
        <button className="btn">Add transaction</button>
      </form>
    </>
  );
};

export default AddTransaction;
