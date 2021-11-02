import { useEffect } from "react";

function User() {
  useEffect(() => {
    fetch("http://localhost:3000/user/12")
      .then((res) => res.json())
      .then((data) => console.log({ data }));
  }, []);
  return <p>Hey user</p>;
}

export default User;
