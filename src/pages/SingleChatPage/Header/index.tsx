const Header = () => {
    return (
        <div className="h-16 border-b flex items-center px-6 gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-300" />
          <div className="text-black">
            <div className="font-semibold">John Doe</div>
            <div className="text-xs text-green-500">online</div>
          </div>
        </div>
    );
}
 
export default Header;