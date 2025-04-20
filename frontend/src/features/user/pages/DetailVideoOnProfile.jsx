import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import VideoProfile from "../components/layout/VideoProfile";
import { fetchVideos } from "../services/apiHome";
import { useAppState } from "../../../store/UserData";
import { useNavigate } from "react-router-dom";
import ContentVideoProfile from "../components/layout/ContentVideoProfile";
import "../styles/DetailVideoOnProfile.css";
import CurrentPath from "../../../hooks/CurrentPath";
import { getProfile } from "../services/apiAccount";
import { getVideoOfUser } from "../services/apiVideo";

const DetailVideoOnProfile = () => {
    const { handleScrollButton, homeRef, currentIndex, setCurrentIndex, isNewVideo, setIsNewVideo, resetIsNewVideo, isCommentOpen, isExpand, setVideoId } = useAppState();

    const containerRef = useRef(null);
    const videoRefs = useRef([]);

    const [uid, setUID] = useState('');
    const [userId, setUserId] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [pov, setPov] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [totalFollowers, setTotalFollowers] = useState(0);
    const [totalFollowing, setTotalFollowing] = useState(0);
    const [totalVideoLikes, setTotalVideoLikes] = useState(0);
    const [profileImage, setProfileImage] = useState('');
    const [user, setUser] = useState({});
    const [videos, setVideos] = useState([]);
    const [video, setVideo] = useState([]);

    const [videoid, setVideoid] = useState(0);

    const navigate = useNavigate();
    const currentPath = CurrentPath();

    useEffect(() => {
        const match = currentPath.match(/@([^/]+)\/video\/(\d+)/);
        if (match) {
            setUID(match[1]);   // vd: "vquan2142_1d04_4"
            setVideoid(match[2]);  // vd: "4"

            console.log("User ID:", uid);
            console.log("Video ID:", videoid);
        }
    }, [currentPath]);

    useEffect(() => {
        const match = currentPath.match(/([^/]+)\/video\/(\d+)/);
        if (match) {
            setUID(match[1]);   // vd: "vquan2142_1d04_4"
            setVideoid(match[2]);  // vd: "4"

            console.log("User ID:", uid);
            console.log("Video ID:", videoid);
        }
        if (!uid) return; // chỉ gọi nếu uid đã được đặt

        const fetchUser = async () => {
            const result = await getProfile(uid);
            if (result.status) {
                const user = result.data;
                setUser(user);
                setPov(user.pov);
                setUserId(user.userid);
                setUsername(user.username);
                setEmail(user.email);
                setDateOfBirth(user.dateOfBirth);
                setTotalFollowers(user.totalFollowers);
                setTotalFollowing(user.totalFollowing);
                setTotalVideoLikes(user.totalVideoLikes);
                setProfileImage(user.profileImage);
            } else {
                console.log("NO USER");
            }
        };

        const fetchVideos = async () => {
            const result = await getVideoOfUser(uid);
            if (result.status) {
                setVideos(result.data.videos);

                // Tìm video theo id trong list
                const foundIndex = result.data.videos.findIndex(video => video.id === Number(videoid));
                console.log(foundIndex)

                if (foundIndex !== -1) {
                    setVideoId(result.data.videos[foundIndex].id); // đảm bảo set đúng id
                    setVideo(result.data.videos[foundIndex]);
                    setCurrentIndex(foundIndex); // nếu bạn dùng currentIndex để scroll đúng vị trí
                } else {
                    console.warn("Không tìm thấy video theo ID, fallback về video đầu tiên");
                    setVideoId(result.data.videos[0]?.id || 0);
                    setCurrentIndex(0);
                }

                setIsNewVideo(true);
                videoRefs.current = result.data.videos.map(() => React.createRef());

                console.log("NO Video");
            } else {
                console.log("NO Video");
            }
        };

        fetchUser();
        fetchVideos();
    }, [uid, currentPath]); // 👈 chỉ gọi lại khi `uid` thay đổi

    // Cung cấp phương thức cuộn cho component cha
    useImperativeHandle(homeRef, () => ({
        scrollToVideo: (index) => {
            if (videoRefs.current[index]?.current) {
                videoRefs.current[index].current.scrollIntoView({ behavior: "smooth", block: "center" });
                setCurrentIndex(index);
                console.log(index)

                setVideoId(videos[index].id)
            }
        }
    }));

    // Xác định video nào đang ở giữa màn hình khi cuộn
    const handleScroll = () => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const scrollPosition = container.scrollTop;
        const containerHeight = container.clientHeight;

        const newIndex = videoRefs.current.findIndex((ref) => {
            if (!ref.current) return false;
            const { offsetTop, offsetHeight } = ref.current;
            return (
                offsetTop < scrollPosition + containerHeight * 0.5 &&
                offsetTop + offsetHeight > scrollPosition + containerHeight * 0.5
            );
        });

        if (newIndex !== -1 && newIndex !== currentIndex) {
            setCurrentIndex(newIndex);
            setVideoId(videos[newIndex].id)
        }
    };

    const handleRedirectProfileUser = () => {
        navigate(`/${uid}`);
    }

    return (
        <div className="d-flex main-detail-profile">
            <div className="home w-100" ref={containerRef} onScroll={handleScroll}>
                <div className="video-container">
                    <div key={video.id} className="video-wrapper-profile">
                        <div className="bgr-close">
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                onClick={() => handleRedirectProfileUser()}
                            ></button>
                        </div>
                        <VideoProfile navigate={navigate} video={video} isNewVideo={isNewVideo} resetIsNewVideo={resetIsNewVideo} />
                    </div>
                </div>
            </div>
            <div className="v-footer">
                <div className="bt-prev" onClick={() => handleScrollButton(-1)}>
                    <i className="bi bi-chevron-up"></i>
                </div>
                <div className="bt-next" onClick={() => handleScrollButton(1)}>
                    <i className="bi bi-chevron-down"></i>
                </div>
            </div>
            <ContentVideoProfile user={user} video={video}/>
        </div>
    );
};

export default DetailVideoOnProfile;
