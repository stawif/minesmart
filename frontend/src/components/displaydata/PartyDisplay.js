import React, { useState, useEffect } from "react";
import { Table } from "react-fluid-table";

export default function PartyDisplay() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/list-of-party/")
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  const columns = [
    {
      key: "owner",
      name: "Owner Name",
      width: 100
    },
    {
      key: "name",
      name: "Name",
      width: 100
    },
    {
      key: "contact",
      name: "Contact no",
      width: 100
    },
    {
      key: "village",
      name: "address",
      width: 100
    },
    {
      key: "party_type",
      name: "party type",
      width: 100
    }
  ];
  return (
    <div>
      <Table data={data} columns={columns} tableHeight={400} />
    </div>
  );
}

