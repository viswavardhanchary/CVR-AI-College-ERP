import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { verify } from "../services/verification.services";
import { Toast } from "../components/Toast";
import { Loading } from "../components/Loading";
import { Cpu } from "lucide-react";

const defaultFilters = {
  loading: false,
  toast: {
    message: '',
    status: false,
    type: ''
  },
  refresh: false,
  navigate: {
    url: '',
    status: false,
  }
};

export default function Ai() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams();
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    getDetails();
  }, [type]);

  const getDetails = async () => {
    setFilters(prev => ({ ...prev, loading: true }));
    const response = await verify(location, type);

    if (response.status) {
      if (response.redirectURL) {
        navigate(response.redirectURL, { replace: true });
      }
      setFilters(prev => ({ ...prev, loading: false }));
    } else if (response.error) {
      setFilters({
        ...filters,
        loading: false,
        toast: {
          message: response.message,
          status: true,
          type: 'error'
        },
        refresh: true
      });
    } else {
      setFilters({
        ...filters,
        loading: false,
        toast: {
          message: response.message,
          status: true,
          type: 'info'
        },
        navigate: {
          status: true,
          url: response.redirectURL
        },
      });
      setTimeout(() => {
        window.location.href = response.redirectURL;
      }, 3000);
    }
  };

  function onClose() {
    setFilters(prev => ({
      ...prev,
      toast: {
        message: "",
        status: false,
        type: ''
      }
    }));
  }

  const userTypeLabel = type === 's' ? 'Student' : type === 't' ? 'Teacher' : type === 'a' ? 'Admin' : 'User';
  const dashboardPath = type === 's' ? 'student-dashboard' : type === 't' ? 'teacher-dashboard' : type === 'a' ? 'admin-dashboard' : '';

  return (
    <div className="min-h-[calc(100vh-4rem)] px-6 py-6">
      {filters.toast.status &&
        <div className="mb-3">
          <Toast
            message={filters.toast.message}
            type={filters.toast.type}
            onClose={onClose}
          />
        </div>
      }
      {filters.refresh &&
        <div className="mb-3 text-sm text-slate-300">Refreshing...</div>
      }
      {filters.navigate.status &&
        <div className="mb-3 text-sm text-slate-300">
          Redirecting to <Link to={filters.navigate.url} className="underline text-blue-400">{filters.navigate.url}</Link>
        </div>
      }

      {!filters.loading && !filters.refresh && !filters.navigate.status &&
        <div className="space-y-6">
          <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-8 shadow-xl">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-cyan-500/10 p-4 text-cyan-300">
                <Cpu className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-white">AI Application</h1>
                <p className="mt-2 text-sm text-slate-400">This is the AI module placeholder for {userTypeLabel} users.</p>
              </div>
            </div>
          </div>

          <div className="rounded-4xl border border-white/10 bg-slate-950/80 p-8 shadow-xl">
            <p className="text-slate-300 leading-relaxed">
              The AI application can be extended here with assistant features, knowledge search, recommendation workflows, and other intelligent utilities.
            </p>
            {dashboardPath &&
              <div className="mt-6">
                <Link
                  to={`/${type}/${dashboardPath}`}
                  className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
                >
                  Back to Dashboard
                </Link>
              </div>
            }
          </div>
        </div>
      }

      {filters.loading &&
        <Loading title="Loading AI Module..." />
      }
    </div>
  );
}
