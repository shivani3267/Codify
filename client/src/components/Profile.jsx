import { useEffect, useState } from "react";
import Navbar from "./Navbar.jsx";
import axiosClient from "../utils/axiosClient.js";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Trash2, Trophy, User } from "lucide-react";
import { logoutUser } from "../authSlice.js";
import Loader from "./Loader.jsx";

function Profile() {
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [solvedProblems, setSolvedProblems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchSolvedProblems = async () => {
            try {

                const { data } = await axiosClient.get(
                    "/problem/ProblemSolvedByUser"
                );

                setSolvedProblems(data);
            } catch (err) {

                toast.error("Unable to load profile");
            } finally {
                setLoading(false);
            }

        };

        fetchSolvedProblems();
    }, []);

    const easyCount = solvedProblems.filter( p => p.difficulty === "easy").length;

    const mediumCount = solvedProblems.filter( p => p.difficulty === "medium").length;

    const hardCount = solvedProblems.filter( p => p.difficulty === "hard").length;

    const handleDeleteProfile = async () => {

        const confirmDelete = window.confirm(  "Are you sure you want to delete your account?");
        if (!confirmDelete) return;

        try {
            await axiosClient.delete("/user/profile");
            toast.success("Profile deleted successfully");
            dispatch(logoutUser());
            navigate("/signup");
        }
        catch (err) {
             toast.error(err.response?.data ||   err.message);
        }

    };

    if (loading) {
        return (<Loader/>);
    }

    return (

        <div className="min-h-screen bg-base-200">

            <Navbar />

            <div className="max-w-5xl mx-auto p-6">
                      {/* Profile Card */}
      <div className="card bg-base-100 shadow-xl mb-8">
        <div className="card-body items-center text-center">

          <div className="avatar placeholder mb-4">
            <div className="bg-primary flex justify-center align-center text-primary-content rounded-full w-24">
              <span className="text-4xl font-bold ">
                {user?.firstName?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-bold">
            {user?.firstName}
          </h1>

          <p className="text-base-content/70">
            {user?.emailId}
          </p>

          <div className="badge badge-primary badge-lg mt-3">
            {user?.role?.toUpperCase()}
          </div>

        </div>
      </div>

      {/* stats */}

      <div className="stats stats-vertical lg:stats-horizontal shadow w-full mb-8">

        <div className="stat">

          <div className="stat-figure text-primary">
            <Trophy size={28}/>
          </div>

          <div className="stat-title">  Problems Solved</div>

          <div className="stat-value text-primary">
            {solvedProblems.length}
          </div>

        </div>

        <div className="stat">

          <div className="stat-title">
            Easy
          </div>

          <div className="stat-value text-success">
            {easyCount}
          </div>

        </div>

        <div className="stat">

          <div className="stat-title">
            Medium
          </div>

          <div className="stat-value text-warning">
            {mediumCount}
          </div>

        </div>

        <div className="stat">

          <div className="stat-title">
            Hard
          </div>

          <div className="stat-value text-error">
            {hardCount}
          </div>

        </div>

      </div>

      {/* Progress */}

      <div className="card bg-base-100 shadow-xl mb-8">

        <div className="card-body">

          <h2 className="card-title mb-6">
            Difficulty Breakdown
          </h2>

          <div className="mb-5">

            <div className="flex justify-between mb-2">
              <span className="font-semibold text-success">
                Easy
              </span>

              <span>{easyCount}</span>
            </div>

            <progress
              className="progress progress-success w-full"
              value={easyCount}
              max={Math.max(solvedProblems.length,1)}
            ></progress>

          </div>

          <div className="mb-5">

            <div className="flex justify-between mb-2">
              <span className="font-semibold text-warning">
                Medium
              </span>

              <span>{mediumCount}</span>
            </div>

            <progress
              className="progress progress-warning w-full"
              value={mediumCount}
              max={Math.max(solvedProblems.length,1)}
            ></progress>

          </div>

          <div>

            <div className="flex justify-between mb-2">
              <span className="font-semibold text-error">
                Hard
              </span>

              <span>{hardCount}</span>
            </div>

            <progress
              className="progress progress-error w-full"
              value={hardCount}
              max={Math.max(solvedProblems.length,1)}
            ></progress>

          </div>

        </div>

      </div>

      {/* Danger Zone */}

      <div className="card bg-base-100 border border-error shadow-xl">

        <div className="card-body">

          <h2 className="card-title text-error">
            Danger Zone
          </h2>

          <p className="text-base-content/70">
            Deleting your account is permanent and cannot be undone.
          </p>

          <button
            onClick={handleDeleteProfile}
            className="btn btn-error mt-4"
          >
            <Trash2 size={18}/>
            Delete Account
          </button>

        </div>
      </div>

    </div>
  </div>

);

}

export default Profile;