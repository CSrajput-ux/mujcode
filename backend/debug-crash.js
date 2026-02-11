
try {
    console.log("Loading routes...");
    const routes = require('./src/routes/adminSystemRoutes');
    console.log("Successfully loaded routes");
} catch (error) {
    console.error("CRASH DETECTED:");
    console.error(error);
}
