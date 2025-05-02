"use client";
export default function Home() {
 

  return (
    <h1 className="text-3xl font-bold underline text-center m-10">
      My Name is <span className="text-blue-500">Anthony Gonzalviz</span>
      <br />
      <ThemeChanger/>
    </h1>
  )
}

function ThemeChanger(){
  const changeTheme = () => {
    const value = document.querySelector("html");
    if (value) {
      value.classList.toggle("dark");
      value.classList.toggle("light");
    }
  };
  return (
    <>
    <button onClick={changeTheme} className="">Change Theme</button>
    </>
  )
}
