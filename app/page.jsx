import PageLogin from "./login/page";
// import users from "@/src/mocks/users.json"


export default function Home() {
	// const user=users[0];
	//  console.log("Mon utilisateur :", user.runningData);
  return (
    <div>
      <main>
		{/* <PageProfile user={user}/>
		<PageDashboard user={user}/> */}
		<PageLogin/>

      </main>
    </div>
  );

}
