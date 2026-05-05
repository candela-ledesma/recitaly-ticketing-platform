import { auth } from "@/app/auth/auth";
import { getBookingsOfUser, getCartItemsOfUser, getUserInfo} from "@/app/lib/recital";
import RecitalCard from "@/app/ui/home/RecitalCard";
import UserInfo from "@/app/ui/profile/UserInfo";
import { Ticket } from 'lucide-react'; // Add this import


export default async function ProfilePage() {
  const session = await auth();
  const user = session?.user;

  if (!user?.id)
    return <p className="mt-20 text-center text-white">Please log in to view your profile.</p>;
    

  
  const userInfo = await getUserInfo(Number(user.id));
  const bookings = await getBookingsOfUser(Number(user.id));
  const cartItems = await getCartItemsOfUser(Number(user.id));

   const activeBookings = bookings.filter(
    (booking) => booking.recital.status === 'ACTIVE'
  );
  const inactiveBookings = bookings.filter(
    (booking) => booking.recital.status === 'INACTIVE'
  );


  return (
    <div className="p-10 bg-[#23232b] text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-pink-200">My Profile</h1>

      
      
      <UserInfo 
        name={user.name || user.name || "User"}
        email={user.email || "No email provided"}
        address={userInfo ? userInfo.adress || "No adress provided" : "No address provided"}
        phone={userInfo ? userInfo.phoneNumber ? userInfo.phoneNumber.toString() : "No phone provided" : "No phone provided"}
      />


      {/* Bookings of active recitals */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-pink-200 mb-4">Upcoming Bookings</h2>
        {activeBookings.length === 0 ? (
          <p className="text-zinc-400">You haven’t booked any upcoming recitals.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {activeBookings.map((booking) => (
              <div key={booking.id} className="relative">
                <RecitalCard recital={booking.recital} />
                <div className="absolute -top-3 -right-3 flex items-center gap-2 bg-pink-200 text-[#23232b] font-bold rounded-full shadow-lg px-3 py-1 min-w-[64px] justify-center transition-all text-sm md:text-base z-10 border-4 border-[#23202b]">
                  <Ticket size={18} className="hidden sm:inline" />
                  <span className="font-extrabold">{booking.amount}</span>
                  <span className="font-medium">
                    {booking.amount === 1 ? "ticket" : "tickets"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bookings of inactive (past) recitals */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-pink-200 mb-4">Past Bookings</h2>
        {inactiveBookings.length === 0 ? (
          <p className="text-zinc-400">No bookings for past recitals.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {inactiveBookings.map((booking) => (
              <div key={booking.id} className="relative">
                <RecitalCard recital={booking.recital} />
                <div className="absolute -top-3 -right-3 flex items-center gap-2 bg-zinc-500 text-white font-bold rounded-full shadow-lg px-3 py-1 min-w-[64px] justify-center transition-all text-sm md:text-base z-10 border-4 border-[#23202b]">
                  <Ticket size={18} className="hidden sm:inline" />
                  <span className="font-extrabold">{booking.amount}</span>
                  <span className="font-medium">
                    {booking.amount === 1 ? "ticket" : "tickets"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sección del carrito */}

      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-pink-200 mb-4">My Cart</h2>
        {cartItems.length === 0 ? (
          <p className="text-zinc-400">Your cart is empty.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {cartItems.map((item) => (
              <RecitalCard key={item.id} recital={item.recital} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
