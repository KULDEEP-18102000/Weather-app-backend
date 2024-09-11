let db;

async function connectToDB() {
    try {
      // Connect the client to the server
      await client.connect();
      console.log("Connected successfully to MongoDB");
  
      app.listen(3000)
  
      // Get the database
      db = client.db(dbName);
  
      // Use the database for your operations here
      return db
  
    } catch (err) {
      console.error(err);
      return err
    } finally {
      // Close the connection
      await client.close();
    }
  }

  export default connectToDB