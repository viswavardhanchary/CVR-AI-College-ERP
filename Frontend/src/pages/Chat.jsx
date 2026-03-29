import { useEffect, useRef, useState } from "react";
import { connectToWebSocket } from "../services/chat.services";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { verify } from "../services/verification.services";
import {Toast} from '../components/Toast';


export const Chat = () => {
  const socket = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = useParams();
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
  }

  const [filters, setFilters] = useState(defaultFilters);
  const [chathistory, setChatHistory] = useState([]);
  const [inputChat, setInputChat] = useState("");
  const [user, setUser] = useState(null);
  const [collegeData, setCollegeData] = useState(null);

  useEffect(() => {
    getDetails();
  }, []);

  const getDetails = async () => {
    setFilters({
      ...filters,
      loading: true
    });
    const response = await verify(location, type);
    if (response.status) {
      if (response.redirectURL) {
        navigate(response.redirectURL, { replace: true });
      }
      setUser(response.user);
      setCollegeData(response.college);
      setFilters({
        ...filters,
        loading: false
      });
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
  }

  function onClose() {
    setFilters({
      ...filters,
      toast: {
        message: "",
        status: false,
        type: ''
      },
    });
  }


  const connectSocket = () => {
    socket.current = connectToWebSocket();

    socket.current.on('connect', () => {
      socket.current.on('recive-message', (data) => {
        console.log(data);
        setChatHistory((prev) => [...prev, data]);
      });

    });


  }


  const handleSubmitMessage = () => {
    const msg = {
      id: Date.now(),
      text: inputChat,
      sender_id: user._id,
      reciver: 'rahul'
    }
    console.log(chathistory);
    // setChatHistory((prev) => [...prev , msg]);
    socket.current.emit('send-message', msg);
  }
  return (
    <>
      <div className="">
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
          <div className="mb-3">
            Refresh....
          </div>
        }
        {filters.navigate.status &&
          <div className="mb-3">
            Redirecting to <Link to={filters.navigate.url} className="underline text-blue-600">{filters.navigate.url}</Link> in a second
          </div>
        }
        {!filters.loading && !filters.refresh && !filters.navigate.status &&
          <div className="w-full h-100 relative">

            {chathistory.length === 0 && <div>No Chat to Display</div>}
            {chathistory.length !== 0 && <div className="flex flex-col gap-5 w-full">
              {chathistory.map((chat) => {
                return (
                  <div key={chat.id} className={`flex w-full ${chat.sender_id === user._id ? "justify-end bg-green-500 border-2" : 'justify-start bg-red-400 border-2'}`}><span className="w-max">{chat.text}</span></div>
                )
              })}
            </div>}
            <button onClick={handleSubmitMessage}>Call</button>
            <input type="text" className="border border-red-600 rounded w-full bottom-0 absolute" value={inputChat} onChange={(e) => setInputChat(e.target.value)} />
          </div>
        }
        {filters.loading &&
          <div className="text-pink-500">Loading....</div>
        }
      </div>

    </>
  )
}