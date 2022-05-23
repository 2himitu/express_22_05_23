// app.js
import express from "express";
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "sbsst",
  password: "sbs123414",
  database: "a9",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const app = express();
app.use(express.json());
const port = 3000;

//삭제
app.delete("/todos/:id", async (req, res) => {
  //const id = req.params.id;
  const { id } = req.params;
  const [rows] = await pool.query(
    `
    SELECT *
    FROM todo
    where id= ?
    `,
    [id]
  );

  if (rows.length == 0) {
    res.status(404).json({
      msg: "not found",
    });
    return res;
  }
  const [rs] = await pool.query(
    `
    delete form todo
    WHERE id = ?
    `,
    [id]
  );
  res.json({
    msg: `${id}번 이 삭제되었습니다.`,
  });
});

// 생성
app.post("/todos", async (req, res) => {
  const [rows] = await pool.query(
    `
    SELECT *
    FROM todo
    `,
    [id]
  );
  if (rows.length == 0) {
    res.status(404).json({
      msg: "not found",
    });
    return res;
  }
  const { perform_date, content } = req.body;
  if (!perform_date) {
    res.status(400).json({
      msg: "perform_date required",
    });
    return res;
  }

  if (!content) {
    res.status(400).json({
      msg: "content required",
    });
    return res;
  }

  const [rs] = await pool.query(
    `
    insert todo
    SET perform_date = ?,
    content = ?
    `,
    [perform_date, content]
  );

  res.json({
    msg: `할일이 추가되었습니다.`,
  });
});

//- 수정 : PATCH
app.patch("/todos/:id", async (req, res) => {
  //const id = req.params.id;
  const { id } = req.params;

  const [rows] = await pool.query(
    `
    SELECT *
    FROM todo
    WHERE id = ?
    `,
    [id]
  );

  if (rows.length == 0) {
    res.status(404).json({
      msg: "not found",
    });
    return res;
  }

  const { perform_date, content } = req.body;

  if (!perform_date) {
    res.status(400).json({
      msg: "perform_date required",
    });
    return res;
  }

  if (!content) {
    res.status(400).json({
      msg: "content required",
    });
    return res;
  }

  const [rs] = await pool.query(
    `
    UPDATE todo
    SET perform_date = ?,
    content = ?
    WHERE id = ?
    `,
    [perform_date, content, id]
  );

  res.json({
    msg: `${id}번 할일이 수정되었습니다.`,
  });
});

//id 조회
app.get("/todos/:id", async (req, res) => {
  //const id = req.params.id;
  const { id } = req.params;

  const [rows] = await pool.query(
    `
    SELECT *
    FROM todo
    WHERE id = ?
    `,
    [id]
  );

  if (rows.length == 0) {
    res.status(404).json({
      msg: "not found",
    });
    return res;
  }

  res.json(rows[0]);
});

// 조회 : GET
app.get("/todos", async (req, res) => {
  const [rows] = await pool.query("SELECT * FROM todo ORDER BY id DESC");

  res.json(rows);
});

app.listen(port);
