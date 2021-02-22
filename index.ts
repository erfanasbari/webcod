import express from "express";
import path from "path";

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const port = process.env.PORT || 80;
app.listen(port, () => {
	console.log(`Webcod server listening on port: ${port}`);
});
