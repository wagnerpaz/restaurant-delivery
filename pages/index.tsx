import { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <main>
      <h1 className="text-blue-600">Hello</h1>
      <form action="/api/upload" method="post" encType="multipart/form-data">
        <label htmlFor="file">Select a file:</label>
        <input type="file" name="image" id="image" />
        <input type="submit" value="Upload" />
      </form>
    </main>
  );
};

export default Home;
