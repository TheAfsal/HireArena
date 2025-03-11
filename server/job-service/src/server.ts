import 'tsconfig-paths/register';
import app from "./app";

const PORT = process.env.PORT || 5002;

app.listen(PORT, () =>
  console.log(`Job Service running at http://localhost:${PORT}`)
);
