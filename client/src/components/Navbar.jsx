import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../authSlice.js";
import toast from "react-hot-toast";
import ConfirmModal from '../components/ConfirmModal.jsx'

function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged Out Successfully");
    } catch (err) {
      toast.error(err || "Logout failed");
    }
  };

  return (
    <nav className="navbar bg-base-100 shadow-lg px-4">
      <div className="flex-1">
        <NavLink to="/" className="font-mono text-xl">
          <span>&lt;</span>
          CODIFY
          <span>/&gt;</span>
        </NavLink>
      </div>

      <div className="flex-none gap-4">
        <div className="dropdown dropdown-end">
          <div tabIndex={0} className="btn btn-ghost">
            {user?.firstName || "Guest"}
          </div>

          <ul className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-44">
            {user ? (
              <>
                {user.role === "admin" && (
                  <li>
                    <NavLink to="/admin">Admin</NavLink>
                  </li>
                )}

                <li>
                  <button
                    onClick={() => document.getElementById("logout_modal").showModal() }
                    className="btn bg-rose-800 hover:bg-rose-900 text-white">
                    Logout
                    </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>

                <li>
                  <NavLink to="/signup">Signup</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      <ConfirmModal id="logout_modal" title="Logout" message="Are you sure you want to logout?" confirmText="Logout"  onConfirm={handleLogout}/>
    </nav>
  );
}

export default Navbar;