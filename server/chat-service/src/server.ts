import 'tsconfig-paths/register';
import app from "./app";

const PORT = process.env.PORT || 5009;

app.listen(PORT, () =>
  console.log(`Chat Service running at http://localhost:${PORT}`)
);


