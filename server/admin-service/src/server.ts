import app from "./app";

const PORT = process.env.PORT || 5003;

app.listen(PORT, () =>
  console.log(`Admin Service running at http://localhost:${PORT}`)
);

