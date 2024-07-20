"use client";

import React from "react";

const AddTransaction = () => {
  const clientAction = async (formData: FormData) => {
    console.log();
  };

  return (
    <>
      <h3>Add transaction</h3>
      <form action={clientAction}>
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
