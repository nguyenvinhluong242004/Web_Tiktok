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
import { useLocation } from 'react-router-dom';

const DetailVideoOnProfile = () => {
    const { handleScrollButton, homeRef, currentIndex, setCurrentIndex, isNewVideo, setIsNewVideo, resetIsNewVideo, isCommentOpen, isExpand, setVideoId } = useAppState();
    const location = useLocation();
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

    const [videoid, setVideoid] = useState(-1);

    const navigate = useNavigate();
    const currentPath = CurrentPath();

    useEffect(() => {
        console.log(currentPath)
        const match = currentPath.match(/@([^/]+)\/video\/(\d+)/);
        if (match) {
            // setUID(match[1]);   // vd: "vquan2142_1d04_4"
            setVideoid(match[2]);  // vd: "4"

            console.log("User ID:", uid);
            console.log("Video ID:", match[2]);
            // Dùng match[2] vì videoid chua kịp thay đổi
            if (videos.length > 0) {
                const foundIndex = videos.findIndex(video => video.id === Number(match[2]));
                console.log(foundIndex)

                if (foundIndex !== -1) {
                    setVideoId(videos[foundIndex].id); // đảm bảo set đúng id
                    setVideo(videos[foundIndex]);
                    setCurrentIndex(foundIndex); // nếu bạn dùng currentIndex để scroll đúng vị trí
                } else {
                    console.warn("Không tìm thấy video theo ID, fallback về video đầu tiên");
                    setVideoId(videos[0]?.id || 0);
                    setCurrentIndex(0);
                }

                setIsNewVideo(true);
                videoRefs.current = videos.map(() => React.createRef());
            }
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
        console.log("kjdsgfksdgfkhgdshjfghj")

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
    }, [uid]); // gọi khi load lại trang thủ công / truy cập đầu tiên

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
            navigate(`/${uid}/video/${videos[newIndex].id}`);
        }
    };

    const handleRedirectProfileUser = () => {
        navigate(`/${uid}`);
    }

    const handleMoveVideo = (key) => {
        if (currentIndex + key < 0 || currentIndex + key >= videos.length) return;
        setCurrentIndex(currentIndex + key);
        navigate(`/${uid}/video/${videos[currentIndex + key].id}`);
    }

    // add sự kiện vuốt + lăn
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        let isScrolling = false;

        const handleWheel = (event) => {
            if (isScrolling) return;
            isScrolling = true;

            if (event.deltaY > 0) {
                console.log("Lăn xuống trong home");
                handleMoveVideo(1);
            } else {
                console.log("Lăn lên trong home");
                handleMoveVideo(-1);
            }

            setTimeout(() => {
                isScrolling = false;
            }, 500); // khoảng thời gian giữa các lần lăn chuột được xử lý
        };

        let startY = 0;
        const handleTouchStart = (e) => {
            startY = e.touches[0].clientY;
        };

        const handleTouchEnd = (e) => {
            if (isScrolling) return;
            const endY = e.changedTouches[0].clientY;
            if (startY - endY > 30) {
                console.log("Vuốt lên trong home");
                handleMoveVideo(1);
            } else if (endY - startY > 30) {
                console.log("Vuốt xuống trong home");
                handleMoveVideo(-1);
            }

            isScrolling = true;
            setTimeout(() => {
                isScrolling = false;
            }, 500);
        };

        container.addEventListener('wheel', handleWheel, { passive: true });
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchend', handleTouchEnd, { passive: true });

        return () => {
            container.removeEventListener('wheel', handleWheel);
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchend', handleTouchEnd);
        };
    }, [containerRef, currentIndex, uid, videos]);


    return (
        <div className="d-flex main-detail-profile">
            <div className="home w-100" ref={containerRef}>
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
                {currentIndex > 0 && <div className="bt-prev" onClick={() => handleMoveVideo(-1)}>
                    <i className="bi bi-chevron-up"></i>
                </div>}
                {currentIndex < videos.length - 1 && <div className="bt-next" onClick={() => handleMoveVideo(1)}>
                    <i className="bi bi-chevron-down"></i>
                </div>}
            </div>
            <ContentVideoProfile user={user} videos={videos} video={video} />
        </div>
    );
};

export default DetailVideoOnProfile;
