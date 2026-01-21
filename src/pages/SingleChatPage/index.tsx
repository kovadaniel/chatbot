import Header from "./Header";
import History from "./History";
import Panel from "./Panel";

export default function SingleChatPage() {
  return (
     <div className="h-screen bg-slate-100 w-full">
      <div className="flex flex-col h-full w-full bg-white">
        <Header />
        <History />
        <Panel />
      </div>
    </div>
  )
}
